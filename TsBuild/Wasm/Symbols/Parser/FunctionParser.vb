Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Scripting.SymbolBuilder.VBLanguage

Namespace Symbols.Parser

    Module FunctionParser

        <Extension>
        Public Function FuncVariable(method As MethodBlockSyntax) As NamedValue(Of String)
            Dim name As String = method.SubOrFunctionStatement.Identifier.ValueText
            Dim returns As Type = GetAsType(method.SubOrFunctionStatement.AsClause)

            Return New NamedValue(Of String) With {
                .Name = name,
                .Value = Types.Convert2Wasm(returns)
            }
        End Function

        ''' <summary>
        ''' 解析出函数的参数列表
        ''' </summary>
        ''' <param name="method"></param>
        ''' <returns></returns>
        <Extension>
        Public Function ParseParameters(method As MethodBlockSyntax) As NamedValue(Of String)()
            Return method.BlockStatement _
                .ParameterList _
                .Parameters _
                .Select(AddressOf ParseParameter) _
                .ToArray
        End Function

        <Extension>
        Public Function Parse(method As MethodBlockSyntax, symbols As SymbolTable) As FuncSymbol
            Dim parameters = method.ParseParameters
            Dim body As StatementSyntax() = method.Statements.ToArray

            For Each arg As NamedValue(Of String) In parameters
                Call symbols.AddLocal(arg)
            Next

            Dim runParser = Function(statement As StatementSyntax)
                                Dim expression As Expression = statement.ParseExpression(symbols)

                                If TypeOf expression Is DeclareLocal Then
                                    Call symbols.AddLocal(expression)
                                End If

                                Return expression
                            End Function

            Dim bodyExpressions As Expression() = body _
                .ExceptType(Of EndBlockStatementSyntax) _
                .Select(Function(s)
                            Return runParser(statement:=s)
                        End Function) _
                .ToArray

            Dim func As New FuncSymbol(method.FuncVariable) With {
                .Parameters = parameters,
                .Body = bodyExpressions
            }

            Return func
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Function GetAsType([as] As SimpleAsClauseSyntax) As Type
            Return Scripting.GetType(DirectCast([as].Type, PredefinedTypeSyntax).Keyword.ValueText)
        End Function

        Public Function ParseParameter(parameter As ParameterSyntax) As NamedValue(Of String)
            Dim name = parameter.Identifier.Identifier.Text
            Dim type As Type
            Dim default$ = Nothing

            If parameter.AsClause Is Nothing Then
                type = Scripting.GetType(Patterns.TypeCharName(name.Last))
                name = name.Substring(0, name.Length - 1)
            Else
                type = GetAsType(parameter.AsClause)
            End If

            If Not parameter.Default Is Nothing Then
                [default] = DirectCast(parameter.Default.Value, LiteralExpressionSyntax).Token.Value
            End If

            Return New NamedValue(Of String) With {
                .Name = name,
                .Value = Types.Convert2Wasm(type),
                .Description = [default]
            }
        End Function
    End Module
End Namespace