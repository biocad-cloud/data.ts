Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.Scripting.SymbolBuilder.VBLanguage

Module BodyParser

    <Extension>
    Public Function ParseExpression(statement As StatementSyntax) As Expression
        Select Case statement.GetType
            Case GetType(LocalDeclarationStatementSyntax)
                Return DirectCast(statement, LocalDeclarationStatementSyntax).LocalDeclare
            Case Else
                Throw New NotImplementedException(statement.GetType.FullName)
        End Select
    End Function

    <Extension>
    Public Function LocalDeclare(statement As LocalDeclarationStatementSyntax) As DeclareLocal
        Dim [declare] = statement.Declarators.First
        Dim name$ = [declare].Names.First.Identifier.Value
        Dim type$ = Types.Convert2Wasm(GetType(Double))

        If Not [declare].AsClause Is Nothing Then
            type = Types.Convert2Wasm(GetAsType([declare].AsClause))
        ElseIf name.Last Like Patterns.TypeChar Then
            type = Types.TypeCharWasm(name.Last)
            name = name.Substring(0, name.Length - 1)
        End If

        If Not [declare].Initializer Is Nothing Then

        End If

        Return New DeclareLocal With {
            .name = name,
            .type = type
        }
    End Function

    <Extension>
    Public Function BinaryStack(expression As BinaryExpressionSyntax) As FuncInvoke

    End Function
End Module
