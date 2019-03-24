Imports Microsoft.CodeAnalysis
Imports Microsoft.CodeAnalysis.VisualBasic
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Scripting.SymbolBuilder.VBLanguage

Module treeTest

    Sub Main()
        Dim code = "Module MNain

Public Function Main(x As Integer, Optional y& = 99) As Long
Return (1+1 + x) * y ^2
End Sub

End Module"
        Dim tree As SyntaxTree = VisualBasicSyntaxTree.ParseText(code)

        Dim root As CompilationUnitSyntax = tree.GetRoot

        Dim main As ModuleBlockSyntax = root.Members(Scan0)

        For Each api_method In main.Members.OfType(Of MethodBlockSyntax)
            Dim parameters = api_method.BlockStatement.ParameterList.Parameters.Select(AddressOf GetParameterType).ToArray
            Dim name = api_method.SubOrFunctionStatement.Identifier.ValueText
            Dim returns = GetAsType(api_method.SubOrFunctionStatement.AsClause)
            Dim body = api_method.Statements.ToArray

            Pause()
        Next

        Pause()
    End Sub

    Public Function GetAsType([as] As SimpleAsClauseSyntax) As String
        Return DirectCast([as].Type, PredefinedTypeSyntax).Keyword.ValueText
    End Function

    Public Function GetParameterType(parameter As ParameterSyntax) As NamedValue(Of String)
        Dim name = parameter.Identifier.Identifier.Text
        Dim type As String

        If parameter.AsClause Is Nothing Then
            type = Patterns.TypeCharName(name.Last)
            name = name.Substring(0, name.Length - 1)
        Else
            type = GetAsType(parameter.AsClause)
        End If

        Return New NamedValue(Of String)(name, type)
    End Function

End Module
