#Region "Microsoft.VisualBasic::11c4af43eeb79cd407c31c8752a4f3ac, Symbols\Parser\BodyParser.vb"

    ' Author:
    ' 
    '       xieguigang (I@xieguigang.me)
    '       asuka (evia@lilithaf.me)
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

    '     Module BodyParser
    ' 
    '         Function: AssignVariable, GetInitialize, LocalDeclare, (+2 Overloads) ParseDeclarator, ParseExpression
    '                   ValueAssign, ValueReturn
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Wasm.Symbols.JavaScriptImports

Namespace Symbols.Parser

    ''' <summary>
    ''' Parser of the function body
    ''' </summary>
    Module BodyParser

        <Extension>
        Public Function ParseExpression(statement As StatementSyntax, symbols As SymbolTable) As [Variant](Of Expression, Expression())
            Select Case statement.GetType
                Case GetType(LocalDeclarationStatementSyntax)
                    Return DirectCast(statement, LocalDeclarationStatementSyntax).LocalDeclare(symbols).ToArray
                Case GetType(AssignmentStatementSyntax)
                    Return DirectCast(statement, AssignmentStatementSyntax).ValueAssign(symbols)
                Case GetType(ReturnStatementSyntax)
                    Return DirectCast(statement, ReturnStatementSyntax).ValueReturn(symbols)
                Case GetType(WhileBlockSyntax)
                    Return DirectCast(statement, WhileBlockSyntax).DoWhile(symbols).ToArray
                Case GetType(MultiLineIfBlockSyntax)
                    Return DirectCast(statement, MultiLineIfBlockSyntax).IfBlock(symbols)
                Case GetType(ForBlockSyntax)
                    Return DirectCast(statement, ForBlockSyntax).ForLoop(symbols).ToArray
                Case GetType(CallStatementSyntax)
                    Return DirectCast(statement, CallStatementSyntax).Invocation.ValueExpression(symbols)
                Case GetType(ExpressionStatementSyntax)
                    Return DirectCast(statement, ExpressionStatementSyntax).Expression.ValueExpression(symbols)
                Case GetType(DoLoopBlockSyntax)
                    Return DirectCast(statement, DoLoopBlockSyntax).DoLoop(symbols).ToArray
                Case Else
                    Throw New NotImplementedException(statement.GetType.FullName)
            End Select
        End Function

        <Extension>
        Public Function ValueReturn(returnValue As ReturnStatementSyntax, symbols As SymbolTable) As Expression
            Dim value As Expression = returnValue.Expression.ValueExpression(symbols)
            Dim returnType As String = symbols _
                .GetFunctionSymbol(Nothing, symbols.CurrentSymbol) _
                .Result

            value = Types.CType(returnType, value, symbols)

            Return New ReturnValue With {
                .Internal = value
            }
        End Function

        <Extension>
        Public Function ValueAssign(assign As AssignmentStatementSyntax, symbols As SymbolTable) As Expression
            If TypeOf assign.Left Is IdentifierNameSyntax Then
                Return symbols.AssignVariable(assign)
            ElseIf TypeOf assign.Left Is InvocationExpressionSyntax Then
                ' 对数组的赋值操作
                Dim left = DirectCast(assign.Left, InvocationExpressionSyntax)
                Dim arrayName = DirectCast(left.Expression, IdentifierNameSyntax).objectName
                Dim index As Expression = left.ArgumentList _
                    .Arguments _
                    .First _
                    .Argument(symbols, New NamedValue(Of String)("a", "i32"))
                Dim arraySymbol As New GetLocalVariable With {.var = arrayName}

                Call symbols.addRequired(JavaScriptImports.SetArrayElement)

                Return New FuncInvoke(JavaScriptImports.SetArrayElement.Name) With {
                    .Parameters = {
                        arraySymbol, index, assign.Right.ValueExpression(symbols)
                    }
                }
            Else
                Throw New NotImplementedException
            End If
        End Function

        <Extension>
        Private Function AssignVariable(symbols As SymbolTable, assign As AssignmentStatementSyntax) As Expression
            Dim var = DirectCast(assign.Left, IdentifierNameSyntax).objectName
            Dim left As Expression
            Dim right = assign.Right.ValueExpression(symbols)
            Dim typeL As String = symbols.GetUnderlyingType(var)
            Dim op$ = assign.OperatorToken.ValueText

            If symbols.IsLocal(var) Then
                left = New GetLocalVariable(var)
            Else
                left = New GetGlobalVariable(var)
            End If

            Select Case op
                Case "*="
                    right = BinaryStack(left, right, "*", symbols)
                Case "+="
                    right = BinaryStack(left, right, "+", symbols)
                Case "-="
                    right = BinaryStack(left, right, "-", symbols)
                Case "/="
                    right = BinaryStack(left, right, "/", symbols)
                Case "="
                    ' do nothing
                Case Else
                    Throw New NotImplementedException
            End Select

            Dim valueRight = Types.CType(typeL, right, symbols)

            If symbols.IsLocal(var) Then
                Return New SetLocalVariable With {
                    .var = var,
                    .value = valueRight
                }
            Else
                Return New SetGlobalVariable With {
                    .var = var,
                    .value = valueRight
                }
            End If
        End Function

        ''' <summary>
        ''' 
        ''' </summary>
        ''' <param name="statement"></param>
        ''' <param name="symbols"></param>
        ''' <returns>May be contains multiple local variables</returns>
        <Extension>
        Public Function LocalDeclare(statement As LocalDeclarationStatementSyntax, symbols As SymbolTable) As IEnumerable(Of Expression)
            Return statement.Declarators.ParseDeclarator(symbols, Nothing)
        End Function

        ''' <summary>
        ''' 
        ''' </summary>
        ''' <param name="names"></param>
        ''' <param name="symbols"></param>
        ''' <param name="moduleName">这个参数是空值表示局部变量，反之表示为模块全局变量</param>
        ''' <returns></returns>
        <Extension>
        Friend Iterator Function ParseDeclarator(names As IEnumerable(Of VariableDeclaratorSyntax),
                                                 symbols As SymbolTable,
                                                 moduleName$) As IEnumerable(Of Expression)

            For Each var As VariableDeclaratorSyntax In names
                For Each [declare] As DeclareLocal In var.ParseDeclarator(symbols, moduleName)
                    If moduleName.StringEmpty Then
                        If Not [declare].init Is Nothing Then
                            Yield [declare].SetLocal
                        End If

                        Call symbols.AddLocal([declare])
                    End If
                Next
            Next
        End Function

        <Extension>
        Friend Iterator Function ParseDeclarator(var As VariableDeclaratorSyntax,
                                                 symbols As SymbolTable,
                                                 moduleName As String) As IEnumerable(Of DeclareLocal)
            Dim fieldNames = var.Names
            Dim type$
            Dim init As Expression = Nothing

            For Each name As String In fieldNames.Select(Function(v) v.Identifier.Text)
                If Not var.Initializer Is Nothing Then
                    init = var.Initializer.GetInitialize(symbols, Nothing)
                    type = name.AsType(var.AsClause, symbols, init.TypeInfer(symbols))
                Else
                    init = Nothing
                    type = name.AsType(var.AsClause, symbols)
                End If

                If Not moduleName.StringEmpty Then
                    If init Is Nothing Then
                        ' 默认是零
                        init = New LiteralExpression(0, type)
                    ElseIf type <> init.TypeInfer(symbols) Then
                        If TypeOf init Is LiteralExpression Then
                            DirectCast(init, LiteralExpression).type = type
                        Else
                            Throw New InvalidExpressionException("Global variable its initialize value only supports constant value!")
                        End If
                    End If

                    Call symbols.AddGlobal(name, type, moduleName, init)
                Else
                    If Not init Is Nothing Then
                        init = Types.CType(type, init, symbols)

                        If TypeOf init Is ArraySymbol Then
                            With DirectCast(init, ArraySymbol)
                                .Type = type.Trim("["c, "]"c)

                                If .Type = GetType(String).FullName Then
                                    .Type = "char*"
                                End If
                            End With

                            Call symbols.doArrayImports
                        End If
                    End If

                    Yield New DeclareLocal With {
                        .name = name,
                        .type = type,
                        .init = init
                    }
                End If
            Next
        End Function

        <Extension>
        Public Function GetInitialize(init As EqualsValueSyntax, symbols As SymbolTable, type$) As Expression
            Dim val As ExpressionSyntax = init.Value

            If TypeOf val Is LiteralExpressionSyntax Then
                If type.StringEmpty Then
                    Return val.ValueExpression(symbols)
                Else
                    With DirectCast(val, LiteralExpressionSyntax)
                        Return .ConstantExpression(type, symbols)
                    End With
                End If
            Else
                Return val.ValueExpression(symbols)
            End If
        End Function
    End Module
End Namespace
