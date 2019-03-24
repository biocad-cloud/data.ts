Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax

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

    End Function
End Module
