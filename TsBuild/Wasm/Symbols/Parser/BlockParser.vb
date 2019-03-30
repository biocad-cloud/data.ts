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

            For Each line In doIf.Statements
                thenBlock += line.ParseExpression(symbols)
            Next

            If Not doIf.ElseBlock Is Nothing Then
                For Each line In doIf.ElseBlock.Statements
                    elseBlock += line.ParseExpression(symbols)
                Next
            End If

            Return New IfBlock With {
                .Condition = test,
                .[Then] = thenBlock,
                .[Else] = elseBlock
            }
        End Function

        <Extension>
        Public Function DoWhile(whileBlock As WhileBlockSyntax, symbols As SymbolTable) As Expression
            Dim block As New [Loop] With {
                .Guid = $"block_{symbols.NextGuid}",
                .LoopID = $"loop_{symbols.NextGuid}"
            }
            Dim internal As New List(Of Expression)
            Dim condition As Expression = whileBlock.whileCondition(symbols)

            internal += New br_if With {.BlockLabel = block.Guid, .Condition = condition}

            For Each statement As StatementSyntax In whileBlock.Statements
                internal += statement.ParseExpression(symbols)
            Next

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