Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Scripting.SymbolBuilder.VBLanguage

Module FunctionParser

    <Extension>
    Public Function Parse(method As MethodBlockSyntax) As FuncSymbol
        Dim parameters = method.BlockStatement _
            .ParameterList _
            .Parameters _
            .Select(AddressOf ParseParameter) _
            .ToArray
        Dim name As String = method.SubOrFunctionStatement.Identifier.ValueText
        Dim returns As Type = GetAsType(method.SubOrFunctionStatement.AsClause)
        Dim body As StatementSyntax() = method.Statements.ToArray
        Dim bodyExpressions As Expression() = body _
            .ExceptType(Of EndBlockStatementSyntax) _
            .Select(Function(s) s.ParseExpression) _
            .ToArray

        Dim func As New FuncSymbol With {
            .Name = $"${name}",
            .Parameters = parameters,
            .Result = Types.Convert2Wasm(returns),
            .Body = bodyExpressions
        }

        Return func
    End Function

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
            .Name = $"${name}",
            .Value = Types.Convert2Wasm(type),
            .Description = [default]
        }
    End Function
End Module
