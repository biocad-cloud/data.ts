Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.Scripting.SymbolBuilder.VBLanguage

Namespace Symbols.Parser

    ''' <summary>
    ''' Parser of the function body
    ''' </summary>
    Module BodyParser

        <Extension>
        Public Function ParseExpression(statement As StatementSyntax, symbols As SymbolTable) As Expression
            Select Case statement.GetType
                Case GetType(LocalDeclarationStatementSyntax)
                    Return DirectCast(statement, LocalDeclarationStatementSyntax).LocalDeclare(symbols)
                Case GetType(AssignmentStatementSyntax)
                    Return DirectCast(statement, AssignmentStatementSyntax).ValueAssign(symbols)
                Case GetType(ReturnStatementSyntax)
                    Return DirectCast(statement, ReturnStatementSyntax).ValueReturn(symbols)
                Case Else
                    Throw New NotImplementedException(statement.GetType.FullName)
            End Select
        End Function

        <Extension>
        Public Function ValueReturn(returnValue As ReturnStatementSyntax, symbols As SymbolTable) As Expression
            Dim value As Expression = returnValue.Expression.ValueExpression(symbols)
            Dim returnType = symbols.GetFunctionSymbol(symbols.CurrentSymbol).Result

            value = Types.CType(returnType, value, symbols)

            Return New ReturnValue With {
                .Internal = value
            }
        End Function

        <Extension>
        Public Function ValueAssign(assign As AssignmentStatementSyntax, symbols As SymbolTable) As Expression
            Dim var = DirectCast(assign.Left, IdentifierNameSyntax).Identifier.ValueText
            Dim right = assign.Right.ValueExpression(symbols)
            Dim typeL As String = symbols.GetObjectSymbol(var).type

            Return New SetLocalVariable With {
                .var = var,
                .value = Types.CType(typeL, right, symbols)
            }
        End Function

        <Extension>
        Public Function LocalDeclare(statement As LocalDeclarationStatementSyntax, symbols As SymbolTable) As DeclareLocal
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
                initValue = [declare].Initializer.Value.ValueExpression(symbols)
                initValue = Types.CType(type, initValue, symbols)
            End If

            Return New DeclareLocal With {
                .name = name,
                .type = type,
                .init = initValue
            }
        End Function
    End Module
End Namespace