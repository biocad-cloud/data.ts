Imports System.IO
Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis
Imports Microsoft.CodeAnalysis.VisualBasic
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Wasm.Symbols.Parser


Namespace Symbols.Parser

    Public Module ModuleParser

        ''' <summary>
        ''' This function have some limitations: 
        ''' 
        ''' 1. <paramref name="vbcode"/> should only have 1 module define in it and no class/strucutre was allowed.
        ''' 2. Only allows numeric algorithm code in the modules
        ''' 3. Not supports string and other non-primitive type.
        ''' </summary>
        ''' <param name="vbcode">This parameter can be file path or file text content.</param>
        ''' <returns></returns>
        Public Function CreateModule(vbcode As [Variant](Of FileInfo, String)) As ModuleSymbol
            Dim tree As SyntaxTree = VisualBasicSyntaxTree.ParseText(vbcode.SolveStream)
            Dim root As CompilationUnitSyntax = tree.GetRoot
            Dim main As ModuleBlockSyntax = root.Members(Scan0)
            Dim functions As New List(Of FuncSymbol)
            Dim exports As New List(Of ExportSymbolExpression)
            Dim symbolTable As New SymbolTable(main.Members.OfType(Of MethodBlockSyntax))
            Dim moduleName$ = main.ModuleStatement.Identifier.Text

            ' 添加declare导入
            Call main.Members _
                .OfType(Of DeclareStatementSyntax) _
                .parseImports(symbolTable)

            ' 添加内部模块变量
            Call main.Members _
                .OfType(Of FieldDeclarationSyntax) _
                .parseGlobals(symbolTable)

            For Each method In main.Members.OfType(Of MethodBlockSyntax)
                functions += method.Parse(symbolTable)
                symbolTable.ClearLocals()

                If method.SubOrFunctionStatement.isExportObject Then
                    exports += New ExportSymbolExpression With {
                        .Name = functions.Last.Name.Trim("$"c),
                        .target = functions.Last.Name,
                        .type = "func"
                    }
                End If
            Next

            Return New ModuleSymbol With {
                .InternalFunctions = functions,
                .LabelName = moduleName,
                .Exports = exports,
                .[Imports] = symbolTable.GetAllImports.ToArray
            }
        End Function

        <Extension>
        Private Sub parseImports(declares As IEnumerable(Of DeclareStatementSyntax), symbolTable As SymbolTable)
            For Each api As DeclareStatementSyntax In declares
                Dim define As NamedValue(Of String) = api.FuncVariable
                Dim apiImports As New ImportSymbol(api.ParseParameters) With {
                    .Name = define.Name,
                    .Result = define.Value,
                    .ImportObject = api.AliasName.Token.ValueText,
                    .Package = api.LibraryName.Token.ValueText
                }

                ' add api symbols for type match in function body
                Call symbolTable.AddImports(apiImports)
            Next
        End Sub

        ''' <summary>
        ''' Parse global variables
        ''' </summary>
        ''' <param name="declares"></param>
        <Extension>
        Private Sub parseGlobals(declares As IEnumerable(Of FieldDeclarationSyntax), symbolTable As SymbolTable)
            For Each field As FieldDeclarationSyntax In declares
                Dim names = field.Declarators

                For Each var As VariableDeclaratorSyntax In names
                    Dim fieldNames = var.Names
                    Dim type$

                    For Each name As String In fieldNames.Select(Function(v) v.Identifier.Text)
                        type = name.AsType(var.AsClause)
                        symbolTable.AddGlobal(name, type)
                    Next
                Next
            Next
        End Sub
    End Module
End Namespace