Imports Microsoft.VisualBasic.Text

Namespace Symbols.Blocks

    Public MustInherit Class Block : Inherits Expression

        ''' <summary>
        ''' The label of this block
        ''' </summary>
        ''' <returns></returns>
        Public Property Guid As String
        Public Property Internal As Expression()

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

        {Internal.Select(Function(line) line.ToSExpression).JoinBy(ASCII.LF)}

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
        Public Property Condition As Expression

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "void"
        End Function

        Public Overrides Function ToSExpression() As String
            Return $"(br_if ${BlockLabel} {Condition})"
        End Function
    End Class

End Namespace