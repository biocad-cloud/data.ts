Imports System.IO
Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis
Imports Microsoft.CodeAnalysis.VisualBasic
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Wasm.Symbols
Imports Wasm.Symbols.Parser
Imports Vbproj = Microsoft.VisualBasic.ApplicationServices.Development.VisualStudio.Project

Public Module Extensions

    ''' <summary>
    ''' Create a WebAssembly module from vb project. 
    ''' </summary>
    ''' <param name="vbproj"></param>
    ''' <returns></returns>
    ''' 
    <MethodImpl(MethodImplOptions.AggressiveInlining)>
    Public Function CreateModuleFromProject(vbproj As String) As ModuleSymbol
        Return vbproj.LoadXml(Of Vbproj).CreateModuleFromProject
    End Function

    <Extension>
    Public Function CreateModuleFromProject(vbproj As Vbproj) As ModuleSymbol

    End Function

    <Extension>
    Private Function SolveStream(vbcode As [Variant](Of FileInfo, String)) As String
        If vbcode Like GetType(String) Then
            Return CType(vbcode, String).SolveStream
        Else
            Return CType(vbcode, FileInfo).FullName.SolveStream
        End If
    End Function

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
        Dim [imports] As New List(Of ImportSymbol)
        Dim symbolTable As New SymbolTable(main.Members.OfType(Of MethodBlockSyntax))

        ' 添加declare导入
        For Each api As DeclareStatementSyntax In main.Members.OfType(Of DeclareStatementSyntax)
            Dim define As NamedValue(Of String) = api.FuncVariable
            Dim apiImports As New ImportSymbol(api.ParseParameters) With {
                .Name = define.Name,
                .Result = define.Value,
                .ImportObject = api.AliasName.Token.ValueText,
                .Package = api.LibraryName.Token.ValueText
            }
            ' add api symbols for type match in function body
            Call [imports].Add(apiImports)
            Call symbolTable.AddImports(apiImports)
        Next

        ' global variable
        For Each field As FieldDeclarationSyntax In main.Members.OfType(Of FieldDeclarationSyntax)
            Dim names = field.Declarators

            For Each var As VariableDeclaratorSyntax In names
                Dim fieldNames = var.Names
                Dim type = var.AsClause


            Next
        Next

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
            .LabelName = main.ModuleStatement.Identifier.Text,
            .Exports = exports,
            .[Imports] = [imports]
        }
    End Function

    <Extension>
    Private Function isExportObject(method As MethodStatementSyntax) As Boolean
        If method.Modifiers.Count = 0 Then
            ' by default is public in VB.NET
            Return True
        Else
            For i As Integer = 0 To method.Modifiers.Count - 1
                If method.Modifiers _
                    .Item(i) _
                    .ValueText _
                    .TextEquals("Public") Then

                    Return True
                End If
            Next

            Return False
        End If
    End Function

    <MethodImpl(MethodImplOptions.AggressiveInlining)>
    <Extension>
    Friend Function param(a As NamedValue(Of String)) As String
        Return $"(param ${a.Name} {a.Value})"
    End Function
End Module