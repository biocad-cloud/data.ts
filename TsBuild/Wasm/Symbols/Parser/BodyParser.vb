Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.Scripting.SymbolBuilder.VBLanguage

Namespace Symbols.Parser

    ''' <summary>
    ''' Parser of the function body
    ''' </summary>
    Module BodyParser

        <Extension>
        Public Function ParseExpression(statement As StatementSyntax) As Expression
            Select Case statement.GetType
                Case GetType(LocalDeclarationStatementSyntax)
                    Return DirectCast(statement, LocalDeclarationStatementSyntax).LocalDeclare
                Case GetType(AssignmentStatementSyntax)
                    Return DirectCast(statement, AssignmentStatementSyntax).ValueAssign
                Case GetType(ReturnStatementSyntax)
                    Return DirectCast(statement, ReturnStatementSyntax).ValueReturn
                Case Else
                    Throw New NotImplementedException(statement.GetType.FullName)
            End Select
        End Function

        <Extension>
        Public Function ValueReturn(returnValue As ReturnStatementSyntax) As Expression
            Return returnValue.Expression.ValueExpression
        End Function

        <Extension>
        Public Function ValueAssign(assign As AssignmentStatementSyntax) As Expression
            Dim var = DirectCast(assign.Left, IdentifierNameSyntax).Identifier.ValueText
            Dim right = assign.Right.ValueExpression

            Return New SetLocalVariable With {
                .var = var,
                .value = right
            }
        End Function

        <Extension>
        Public Function LocalDeclare(statement As LocalDeclarationStatementSyntax) As DeclareLocal
            Dim [declare] = statement.Declarators.First
            Dim name$ = [declare].Names.First.Identifier.Value
            Dim type$ = Types.Convert2Wasm(GetType(Double))
            Dim initValue As Expression = Nothing

            If Not [declare].AsClause Is Nothing Then
                type = Types.Convert2Wasm(GetAsType([declare].AsClause))
            ElseIf name.Last Like Patterns.TypeChar Then
                type = Types.TypeCharWasm(name.Last)
                name = name.Substring(0, name.Length - 1)
            End If

            If Not [declare].Initializer Is Nothing Then
                initValue = [declare].Initializer.Value.ValueExpression
            End If

            Return New DeclareLocal With {
                .name = name,
                .type = type,
                .init = initValue
            }
        End Function
    End Module
End Namespace