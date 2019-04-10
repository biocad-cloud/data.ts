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
                    Return DirectCast(statement, LocalDeclarationStatementSyntax).LocalDeclare(symbols).ToArray
                Case GetType(AssignmentStatementSyntax)
                    Return DirectCast(statement, AssignmentStatementSyntax).ValueAssign(symbols)
                Case GetType(ReturnStatementSyntax)
                    Return DirectCast(statement, ReturnStatementSyntax).ValueReturn(symbols)
                Case GetType(WhileBlockSyntax)
                    Return DirectCast(statement, WhileBlockSyntax).DoWhile(symbols)
                Case GetType(MultiLineIfBlockSyntax)
                    Return DirectCast(statement, MultiLineIfBlockSyntax).IfBlock(symbols)
                Case GetType(ForBlockSyntax)
                    Return DirectCast(statement, ForBlockSyntax).ForLoop(symbols).ToArray
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
        Public Function LocalDeclare(statement As LocalDeclarationStatementSyntax, symbols As SymbolTable) As IEnumerable(Of Expression)
            Return statement.Declarators.ParseDeclarator(symbols, False)
        End Function

        <Extension>
        Friend Iterator Function ParseDeclarator(names As IEnumerable(Of VariableDeclaratorSyntax),
                                                 symbols As SymbolTable,
                                                 isGlobal As Boolean) As IEnumerable(Of Expression)

            For Each var As VariableDeclaratorSyntax In names
                For Each [declare] As DeclareLocal In var.ParseDeclarator(symbols, isGlobal)
                    If Not isGlobal Then
                        If Not [declare].init Is Nothing Then
                            Yield [declare].SetLocal
                        End If

                        Call symbols.AddLocal([declare])
                    End If
                Next
            Next
        End Function

        <Extension>
        Friend Iterator Function ParseDeclarator(var As VariableDeclaratorSyntax,
                                                 symbols As SymbolTable,
                                                 isGlobal As Boolean) As IEnumerable(Of DeclareLocal)
            Dim fieldNames = var.Names
            Dim type$
            Dim init As Expression

            For Each name As String In fieldNames.Select(Function(v) v.Identifier.Text)
                type = name.AsType(var.AsClause)

                If isGlobal Then
                    If var.Initializer Is Nothing Then
                        ' 默认是零
                        init = New LiteralExpression(0, type)
                    Else
                        init = var.Initializer.GetInitialize(symbols, type)
                    End If

                    Call symbols.AddGlobal(name, type, init)
                Else
                    If Not var.Initializer Is Nothing Then
                        init = var.Initializer.GetInitialize(symbols, Nothing)
                        init = Types.CType(type, init, symbols)
                    Else
                        init = Nothing
                    End If

                    Yield New DeclareLocal With {
                        .name = name,
                        .type = type,
                        .init = init
                    }
                End If
            Next
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