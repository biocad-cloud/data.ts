Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.Language
Imports Microsoft.VisualBasic.Scripting.SymbolBuilder.VBLanguage

Namespace Symbols.Parser

    ''' <summary>
    ''' Parser of the function body
    ''' </summary>
    Module BodyParser

        <Extension>
        Public Function ParseExpression(statement As StatementSyntax, symbols As SymbolTable) As [Variant](Of Expression, Expression())
            Select Case statement.GetType
                Case GetType(LocalDeclarationStatementSyntax)
                    Return DirectCast(statement, LocalDeclarationStatementSyntax).LocalDeclare(symbols)
                Case GetType(AssignmentStatementSyntax)
                    Return DirectCast(statement, AssignmentStatementSyntax).ValueAssign(symbols)
                Case GetType(ReturnStatementSyntax)
                    Return DirectCast(statement, ReturnStatementSyntax).ValueReturn(symbols)
                Case GetType(WhileBlockSyntax)
                    Return DirectCast(statement, WhileBlockSyntax).DoWhile(symbols)
                Case GetType(MultiLineIfBlockSyntax)
                    Return DirectCast(statement, MultiLineIfBlockSyntax).IfBlock(symbols)
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
            Dim op$ = assign.OperatorToken.ValueText

            Select Case op
                Case "*="
                    right = BinaryStack(New GetLocalVariable(var), right, "*", symbols)
                Case "+="
                    right = BinaryStack(New GetLocalVariable(var), right, "+", symbols)
                Case "-="
                    right = BinaryStack(New GetLocalVariable(var), right, "-", symbols)
                Case "/="
                    right = BinaryStack(New GetLocalVariable(var), right, "/", symbols)
                Case "="
                    ' do nothing
                Case Else
                    Throw New NotImplementedException
            End Select

            Return New SetLocalVariable With {
                .var = var,
                .value = Types.CType(typeL, right, symbols)
            }
        End Function

        ''' <summary>
        ''' 
        ''' </summary>
        ''' <param name="statement"></param>
        ''' <param name="symbols"></param>
        ''' <returns>May be contains multiple local variables</returns>
        <Extension>
        Public Function LocalDeclare(statement As LocalDeclarationStatementSyntax, symbols As SymbolTable) As Expression
            Dim [declare] = statement.Declarators.First
            Dim name$ = [declare].Names.First.Identifier.Value
            Dim initValue As Expression = Nothing
            Dim type$ = name.AsType([declare].AsClause)

            If Not [declare].Initializer Is Nothing Then
                initValue = [declare].Initializer.GetInitialize(symbols, Nothing)
                initValue = Types.CType(type, initValue, symbols)
            End If

            Return New DeclareLocal With {
                .name = name,
                .type = type,
                .init = initValue
            }
        End Function

        <Extension>
        Public Function GetInitialize(init As EqualsValueSyntax, symbols As SymbolTable, type$) As Expression
            Dim val As ExpressionSyntax = init.Value

            If TypeOf val Is LiteralExpressionSyntax Then
                If type.StringEmpty Then
                    Return val.ValueExpression(symbols)
                Else
                    With DirectCast(val, LiteralExpressionSyntax)
                        Return .ConstantExpression(type)
                    End With
                End If
            ElseIf TypeOf val Is UnaryExpressionSyntax Then
                ' unary
                Dim unary As UnaryExpressionSyntax = val
                Dim op$ = unary.OperatorToken.ValueText
                Dim right As LiteralExpression

                With DirectCast(unary.Operand, LiteralExpressionSyntax)
                    right = .ConstantExpression(type)
                    right.value = op & right.value
                End With

                Return right
            Else
                Return val.ValueExpression(symbols)
            End If
        End Function
    End Module
End Namespace