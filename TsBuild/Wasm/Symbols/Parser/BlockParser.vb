#Region "Microsoft.VisualBasic::d9a9c03ddd73f19786a1a500e4b1622a, Symbols\Parser\BlockParser.vb"

    ' Author:
    ' 
    '       xieguigang (I@xieguigang.me)
    '       asuka (evia@lilithaf.me)
    ' 
    ' Copyright (c) 2019 GCModeller Cloud Platform
    ' 
    ' 
    ' MIT License
    ' 
    ' 
    ' Permission is hereby granted, free of charge, to any person obtaining a copy
    ' of this software and associated documentation files (the "Software"), to deal
    ' in the Software without restriction, including without limitation the rights
    ' to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    ' copies of the Software, and to permit persons to whom the Software is
    ' furnished to do so, subject to the following conditions:
    ' 
    ' The above copyright notice and this permission notice shall be included in all
    ' copies or substantial portions of the Software.
    ' 
    ' THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    ' IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    ' FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    ' AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    ' LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    ' OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    ' SOFTWARE.



    ' /********************************************************************************/

    ' Summaries:

    '     Module BlockParser
    ' 
    '         Function: ctlGetLocal, DoWhile, ForLoop, IfBlock, ParseBlockInternal
    '                   parseControlVariable, parseForLoopTest, whileCondition
    ' 
    ' 
    ' /********************************************************************************/

#End Region

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
            Dim elseBlock As Expression()
            Dim thenBlock As Expression() = doIf.Statements.ParseBlockInternal(symbols)

            If Not doIf.ElseBlock Is Nothing Then
                elseBlock = doIf.ElseBlock.Statements.ParseBlockInternal(symbols)
            Else
                elseBlock = {}
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
        Public Iterator Function ForLoop(forBlock As ForBlockSyntax, symbols As SymbolTable) As IEnumerable(Of Expression)
            Dim control As Expression = forBlock.parseControlVariable(symbols)
            Dim init = forBlock.ForStatement.FromValue.ValueExpression(symbols)
            Dim final = forBlock.ForStatement.ToValue.ValueExpression(symbols)
            Dim stepValue As Expression

            ' set for loop variable init value
            If TypeOf control Is DeclareLocal Then
                Yield New SetLocalVariable With {
                    .var = DirectCast(control, DeclareLocal).name,
                    .value = Types.CType(control.TypeInfer(symbols), init, symbols)
                }
            Else
                Yield control
            End If

            If forBlock.ForStatement.StepClause Is Nothing Then
                ' 默认是1
                stepValue = New LiteralExpression(1, control.TypeInfer(symbols))
            Else
                stepValue = forBlock.ForStatement _
                    .StepClause _
                    .StepValue _
                    .ValueExpression(symbols)
            End If

            Yield New CommentText With {
                .Text = forBlock.ForStatement.ToString
            }

            Dim block As New [Loop] With {
                .Guid = $"block_{symbols.NextGuid}",
                .LoopID = $"loop_{symbols.NextGuid}"
            }
            Dim break As New br_if With {
                .BlockLabel = block.Guid,
                .Condition = parseForLoopTest(control, stepValue, final, symbols)
            }
            Dim [next] As New br With {.BlockLabel = block.LoopID}
            Dim internal As New List(Of Expression)
            Dim controlVar = control.ctlGetLocal
            Dim doStep = ExpressionParse.BinaryStack(controlVar, stepValue, "+", symbols)

            internal += break
            internal += New SetLocalVariable With {.var = controlVar.var, .value = doStep}
            internal += forBlock.Statements.ParseBlockInternal(symbols)
            internal += [next]
            internal += New CommentText With {
                .Text = $"For Loop Next On {[next].BlockLabel}"
            }

            block.Internal = internal

            Yield block
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

            If TypeOf control Is DeclareLocal Then
                With DirectCast(control, DeclareLocal)
                    Call symbols.AddLocal(.ByRef)
                End With
            End If

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
                    If Not .Sign > 0 Then
                        ctrlTest = BooleanSymbol.BinaryCompares(ctlVar, [to], ">", symbols)
                    Else
                        ctrlTest = BooleanSymbol.BinaryCompares(ctlVar, [to], "<", symbols)
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
                Dim declareCtl = DirectCast(control, VariableDeclaratorSyntax) _
                    .ParseDeclarator(symbols, False) _
                    .First

                Return declareCtl
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

                If lineSymbols.GetUnderlyingType.IsInheritsFrom(GetType(Expression)) Then
                    internal += lineSymbols.TryCast(Of Expression)
                Else
                    internal += lineSymbols.TryCast(Of Expression())
                End If
            Next

            Return internal
        End Function

        <Extension>
        Public Iterator Function DoWhile(whileBlock As WhileBlockSyntax, symbols As SymbolTable) As IEnumerable(Of Expression)
            Dim block As New [Loop] With {
                .Guid = $"block_{symbols.NextGuid}",
                .LoopID = $"loop_{symbols.NextGuid}"
            }
            Dim internal As New List(Of Expression)
            Dim condition As Expression = whileBlock.whileCondition(symbols)

            Yield New CommentText With {.Text = $"Start Do While Block {block.Guid}"}

            internal += New br_if With {
                .BlockLabel = block.Guid,
                .Condition = condition
            }
            internal += whileBlock.Statements.ParseBlockInternal(symbols)
            internal += New br With {.BlockLabel = block.LoopID}

            block.Internal = internal

            Yield block
            Yield New CommentText With {.Text = $"End Loop {block.LoopID}"}
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
