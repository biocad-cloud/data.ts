#Region "Microsoft.VisualBasic::7a7eabdeb3a618f6161ea029e288a2da, Symbols\Parser\ModuleParser.vb"

    ' Author:
    ' 
    '       xieguigang (I@xieguigang.me)
    ' 
    ' Copyright (c) 2019 GCModeller Cloud Platform
    ' 
    ' 
    ' MIT License
    ' 
    ' 
    ' Permission is hereby granted, free of charge, to any person obtaining a copy
    ' of this software and associated documentation files (the "Software"), to deal
    ' in the Software without restriction, including without limitation the rights
    ' to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    ' copies of the Software, and to permit persons to whom the Software is
    ' furnished to do so, subject to the following conditions:
    ' 
    ' The above copyright notice and this permission notice shall be included in all
    ' copies or substantial portions of the Software.
    ' 
    ' THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    ' IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    ' FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    ' AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    ' LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    ' OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    ' SOFTWARE.



    ' /********************************************************************************/

    ' Summaries:

    '     Module ModuleParser
    ' 
    '         Function: CreateModule
    ' 
    '         Sub: parseGlobals, parseImports
    ' 
    ' 
    ' /********************************************************************************/

#End Region

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
                .[Imports] = symbolTable.GetAllImports.ToArray,
                .Globals = symbolTable.GetAllGlobals.ToArray
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
                ' 已经在函数的内部进行添加调用了
                Call field.Declarators _
                    .ParseDeclarator(symbolTable, isGlobal:=True) _
                    .ToArray
            Next
        End Sub
    End Module
End Namespace
