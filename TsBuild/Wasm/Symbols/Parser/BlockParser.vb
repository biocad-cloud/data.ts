Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.Language
Imports Wasm.Symbols.Blocks

Namespace Symbols.Parser

    Module BlockParser

        <Extension>
        Public Function IfBlock(doIf As MultiLineIfBlockSyntax, symbols As SymbolTable) As Expression
            Dim test As New BooleanSymbol With {
                .Condition = doIf _
                    .IfStatement _
                    .Condition _
                    .ValueExpression(symbols)
            }
            Dim thenBlock As New List(Of Expression)
            Dim elseBlock As New List(Of Expression)
            Dim lineSymbols As [Variant](Of Expression, Expression())

            For Each line In doIf.Statements
                lineSymbols = line.ParseExpression(symbols)

                If lineSymbols Like GetType(Expression) Then
                    thenBlock += lineSymbols.TryCast(Of Expression)
                Else
                    thenBlock += lineSymbols.TryCast(Of Expression())
                End If
            Next

            If Not doIf.ElseBlock Is Nothing Then
                For Each line In doIf.ElseBlock.Statements
                    lineSymbols = line.ParseExpression(symbols)

                    If lineSymbols Like GetType(Expression) Then
                        elseBlock += lineSymbols.TryCast(Of Expression)
                    Else
                        elseBlock += lineSymbols.TryCast(Of Expression())
                    End If
                Next
            End If

            Return New IfBlock With {
                .Condition = test,
                .[Then] = thenBlock,
                .[Else] = elseBlock
            }
        End Function

        ''' <summary>
        ''' Convert for loop for while loop
        ''' </summary>
        ''' <param name="forBlock"></param>
        ''' <param name="symbols"></param>
        ''' <returns></returns>
        <Extension>
        Public Function ForLoop(forBlock As ForBlockSyntax, symbols As SymbolTable) As Expression
            Dim control As Expression = forBlock.parseControlVariable(symbols)
            Dim init = forBlock.ForStatement.FromValue.ValueExpression(symbols)
            Dim final = forBlock.ForStatement.ToValue.ValueExpression(symbols)
            Dim stepValue As Expression

            If forBlock.ForStatement.StepClause Is Nothing Then
                ' 默认是1
                stepValue = New LiteralExpression(1, control.TypeInfer(symbols))
            Else
                stepValue = forBlock.ForStatement _
                    .StepClause _
                    .StepValue _
                    .ValueExpression(symbols)
            End If

            Dim block As New [Loop] With {
                .Guid = $"block_{symbols.NextGuid}",
                .LoopID = $"loop_{symbols.NextGuid}"
            }
            Dim break As New br_if With {
                .BlockLabel = block.Guid,
                .Condition = parseForLoopTest(control, stepValue, final, symbols)
            }
            Dim [next] As New br With {.BlockLabel = Block.LoopID}
            Dim internal As New List(Of Expression)

            internal += break
            internal += ExpressionParse.BinaryStack(control.ctlGetLocal, stepValue, "+", symbols)
            internal += forBlock.Statements.ParseBlockInternal(symbols)
            internal += [next]

            block.Internal = internal

            Return block
        End Function

        <Extension>
        Private Function ctlGetLocal(control As Expression) As GetLocalVariable
            If TypeOf control Is DeclareLocal Then
                Return New GetLocalVariable With {
                    .var = DirectCast(control, DeclareLocal).name
                }
            Else
                Return control
            End If
        End Function

        Private Function parseForLoopTest(control As Expression, [step] As Expression, [to] As Expression, symbols As SymbolTable) As BooleanSymbol
            Dim ctlVar As GetLocalVariable = control.ctlGetLocal
            Dim ctrlTest As BooleanSymbol

            ' for i = 0 to 10 step 1
            ' equals to
            '
            ' if i >= 10 then
            '    break
            ' end if

            ' for i = 10 to 0 step -1
            ' equals to
            '
            ' if i <= 0 then
            '    break
            ' end if

            If TypeOf [step] Is LiteralExpression Then
                With DirectCast([step], LiteralExpression)
                    If .Sign > 0 Then
                        ctrlTest = BooleanSymbol.BinaryCompares(ctlVar, [to], ">=", symbols)
                    Else
                        ctrlTest = BooleanSymbol.BinaryCompares(ctlVar, [to], "<=", symbols)
                    End If
                End With
            Else
                ctrlTest = BooleanSymbol.BinaryCompares(ctlVar, [to], "=", symbols)
            End If

            Return ctrlTest
        End Function

        <Extension>
        Private Function parseControlVariable(forBlock As ForBlockSyntax, symbols As SymbolTable) As Expression
            Dim control = forBlock.ForStatement.ControlVariable

            If TypeOf control Is VariableDeclaratorSyntax Then
                Return DirectCast(control, VariableDeclaratorSyntax).ParseDeclarator(symbols, False).First
            Else
                ' reference a local variable
                Throw New NotImplementedException
            End If
        End Function

        <Extension>
        Friend Function ParseBlockInternal(block As IEnumerable(Of StatementSyntax), symbols As SymbolTable) As Expression()
            Dim lineSymbols As [Variant](Of Expression, Expression())
            Dim internal As New List(Of Expression)

            For Each statement As StatementSyntax In block
                lineSymbols = statement.ParseExpression(symbols)

                If lineSymbols Like GetType(Expression) Then
                    Internal += lineSymbols.TryCast(Of Expression)
                Else
                    Internal += lineSymbols.TryCast(Of Expression())
                End If
            Next

            Return internal
        End Function

        <Extension>
        Public Function DoWhile(whileBlock As WhileBlockSyntax, symbols As SymbolTable) As Expression
            Dim block As New [Loop] With {
                .Guid = $"block_{symbols.NextGuid}",
                .LoopID = $"loop_{symbols.NextGuid}"
            }
            Dim internal As New List(Of Expression)
            Dim condition As Expression = whileBlock.whileCondition(symbols)

            internal += New br_if With {
                .BlockLabel = block.Guid,
                .Condition = condition
            }
            internal += whileBlock.Statements.ParseBlockInternal(symbols)
            internal += New br With {.BlockLabel = block.LoopID}

            block.Internal = internal

            Return block
        End Function

        <Extension>
        Private Function whileCondition(whileBlock As WhileBlockSyntax, symbols As SymbolTable) As Expression
            Dim condition As Expression = whileBlock _
                .WhileStatement _
                .Condition _
                .ValueExpression(symbols)

            Return New BooleanSymbol With {
                .Condition = condition,
                .[IsNot] = True
            }
        End Function
    End Module
End Namespace