#Region "Microsoft.VisualBasic::d5e3bd829fc19162facafe20c058b7d9, Symbols\Parser\FunctionParser.vb"

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

    '     Module FunctionParser
    ' 
    '         Function: (+2 Overloads) FuncVariable, Parse, ParseParameter, (+3 Overloads) ParseParameters, runParser
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.ComponentModel.Collection
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Microsoft.VisualBasic.Linq
Imports Microsoft.VisualBasic.Scripting.SymbolBuilder.VBLanguage

Namespace Symbols.Parser

    Module FunctionParser

        <Extension>
        Public Function FuncVariable(method As MethodBlockSyntax, symbols As SymbolTable) As NamedValue(Of String)
            Dim name As String = method.SubOrFunctionStatement.Identifier.objectName
            Dim returns As Type = GetAsType(method.SubOrFunctionStatement.AsClause, symbols)

            Return New NamedValue(Of String) With {
                .Name = name,
                .Value = Types.Convert2Wasm(returns)
            }
        End Function

        <Extension>
        Public Function FuncVariable(api As DeclareStatementSyntax, symbols As SymbolTable) As NamedValue(Of String)
            Dim name As String = api.Identifier.objectName
            Dim returns As Type = GetAsType(api.AsClause, symbols)

            Return New NamedValue(Of String) With {
                .Name = name,
                .Value = Types.Convert2Wasm(returns)
            }
        End Function

        ''' <summary>
        ''' 解析出函数的参数列表
        ''' </summary>
        ''' <param name="api"></param>
        ''' <returns></returns>
        ''' 
        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        <Extension>
        Public Function ParseParameters(api As DeclarationStatementSyntax) As NamedValue(Of String)()
            Return DirectCast(api, MethodBaseSyntax).ParseParameters.ToArray
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        <Extension>
        Private Function ParseParameters(method As MethodBaseSyntax, symbols As SymbolTable) As IEnumerable(Of NamedValue(Of String))
            Return method.ParameterList _
                .Parameters _
                .Select(Function(p) ParseParameter(p, symbols))
        End Function

        ''' <summary>
        ''' 解析出函数的参数列表
        ''' </summary>
        ''' <param name="method"></param>
        ''' <returns></returns>
        ''' 
        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        <Extension>
        Public Function ParseParameters(method As MethodBlockSyntax) As NamedValue(Of String)()
            Return method.BlockStatement.ParseParameters.ToArray
        End Function

        <Extension>
        Public Function Parse(method As MethodBlockSyntax, symbols As SymbolTable) As FuncSymbol
            Dim parameters = method.ParseParameters
            Dim body As StatementSyntax() = method.Statements.ToArray
            Dim funcVar = method.FuncVariable(symbols)

            ' using for return value ctype operation
            symbols.CurrentSymbol = funcVar.Name

            For Each arg As NamedValue(Of String) In parameters
                Call symbols.AddLocal(arg)
            Next

            Dim paramIndex As Index(Of String) = parameters.Keys
            Dim runParser = symbols.runParser
            Dim bodyExpressions As Expression() = body _
                .ExceptType(Of EndBlockStatementSyntax) _
                .Select(Function(s)
                            Return runParser(s)
                        End Function) _
                .IteratesALL _
                .ToArray
            Dim func As New FuncSymbol(funcVar) With {
                .Parameters = parameters,
                .Body = bodyExpressions,
                .Locals = symbols _
                    .GetAllLocals _
                    .Where(Function(v) Not v.name Like paramIndex) _
                    .ToArray
            }

            If Not TypeOf func.Body.Last Is ReturnValue Then
                Dim implicitReturn As New ReturnValue With {
                    .Internal = New LiteralExpression With {
                        .type = funcVar.Value,
                        .value = 0
                    }
                }

                ' 自动添加一个返回语句，如果最后一行没有返回表达式的话？
                Call func.Body.Add(implicitReturn)
            End If

            Return func
        End Function

        <Extension>
        Private Function runParser(symbols As SymbolTable) As Func(Of StatementSyntax, Expression())
            Return Function(statement As StatementSyntax)
                       Dim expression As [Variant](Of Expression, Expression()) = statement.ParseExpression(symbols)
                       Dim expressionList As Expression()

                       If expression.GetUnderlyingType.IsInheritsFrom(GetType(Expression)) Then
                           expressionList = {expression.TryCast(Of Expression)}
                       Else
                           expressionList = expression
                       End If

                       Return expressionList
                   End Function
        End Function

        Public Function ParseParameter(parameter As ParameterSyntax, symbols As SymbolTable) As NamedValue(Of String)
            Dim name = parameter.Identifier.Identifier.Text
            Dim type As Type
            Dim default$ = Nothing

            If parameter.AsClause Is Nothing Then
                type = Scripting.GetType(Patterns.TypeCharName(name.Last))
                name = name.Substring(0, name.Length - 1)
            Else
                type = GetAsType(parameter.AsClause, symbols)
            End If

            If Not parameter.Default Is Nothing Then
                With DirectCast(parameter.Default.Value, LiteralExpressionSyntax)
                    [default] = .Token.Value
                End With
            End If

            Return New NamedValue(Of String) With {
                .Name = name,
                .Value = Types.Convert2Wasm(type),
                .Description = [default]
            }
        End Function
    End Module
End Namespace
