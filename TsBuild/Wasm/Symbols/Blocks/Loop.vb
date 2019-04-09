Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.Text
Imports Wasm.Symbols.Parser

Namespace Symbols.Blocks

    Public MustInherit Class AbstractBlock : Inherits Expression
        ''' <summary>
        ''' The label of this block
        ''' </summary>
        ''' <returns></returns>
        Public Property Guid As String

    End Class

    Public MustInherit Class Block : Inherits AbstractBlock

        Public Property Internal As Expression()

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Shared Function InternalBlock(block As IEnumerable(Of Expression), indent As String) As String
            Return block _
                .Select(Function(line) indent & line.ToSExpression) _
                .JoinBy(ASCII.LF)
        End Function
    End Class

    Public Class [Loop] : Inherits Block

        Public Property LoopID As String

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "void"
        End Function

        Public Overrides Function ToSExpression() As String
            Return $"
(block ${Guid} 
    (loop ${LoopID}

        {InternalBlock(Internal, "        ")}

    )
)"
        End Function
    End Class

    Public Class br : Inherits Expression

        Public Property BlockLabel As String

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "void"
        End Function

        Public Overrides Function ToSExpression() As String
            Return $"(br ${BlockLabel})"
        End Function
    End Class

    Public Class br_if : Inherits br

        ''' <summary>
        ''' Is a logical expression
        ''' </summary>
        ''' <returns></returns>
        Public Property Condition As BooleanSymbol

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "void"
        End Function

        Public Overrides Function ToSExpression() As String
            Return $"(br_if ${BlockLabel} {Condition})"
        End Function
    End Class

End Namespace