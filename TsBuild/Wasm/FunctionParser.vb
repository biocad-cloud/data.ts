Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Microsoft.VisualBasic.Scripting.SymbolBuilder.VBLanguage

Module FunctionParser

    <Extension>
    Public Function Parse(method As MethodBlockSyntax) As Func
        Dim parameters = method.BlockStatement.ParameterList.Parameters.Select(AddressOf GetParameterType).ToArray
        Dim name = method.SubOrFunctionStatement.Identifier.ValueText
        Dim returns = GetAsType(method.SubOrFunctionStatement.AsClause)
        Dim body = method.Statements.ToArray
        Dim bodyExpressions As New List(Of Expression)

        For Each line In body.ExceptType(Of EndBlockStatementSyntax)

        Next

        Dim func As New Func With {
            .Name = name,
            .Parameters = parameters,
            .Result = Types.Convert2Wasm(returns),
            .Body = bodyExpressions
        }

        Return func
    End Function

    Public Function GetAsType([as] As SimpleAsClauseSyntax) As Type
        Return Scripting.GetType(DirectCast([as].Type, PredefinedTypeSyntax).Keyword.ValueText)
    End Function

    Public Function GetParameterType(parameter As ParameterSyntax) As NamedValue(Of String)
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

        Return New NamedValue(Of String)(name, Types.Convert2Wasm(type), [default])
    End Function
End Module
