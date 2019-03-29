Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.Language
Imports Wasm.Symbols.Blocks

Namespace Symbols.Parser

    Module BlockParser

        <Extension>
        Public Function DoWhile(whileBlock As WhileBlockSyntax, symbols As SymbolTable) As Expression
            Dim block As New [Loop] With {
                .Guid = $"block_{symbols.NextGuid}",
                .LoopID = $"loop_{symbols.NextGuid}"
            }
            Dim internal As New List(Of Expression)
            Dim condition As Expression = whileBlock _
                .WhileStatement _
                .Condition _
                .ValueExpression(symbols)

            internal += New br_if With {.BlockLabel = block.Guid, .Condition = condition}
            internal += New br With {
                .BlockLabel = block.LoopID
            }

            For Each statement As StatementSyntax In whileBlock.Statements
                internal += statement.ParseExpression(symbols)
            Next

            block.Internal = internal

            Return block
        End Function
    End Module
End Namespace