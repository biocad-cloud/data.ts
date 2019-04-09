Namespace Symbols

    ''' <summary>
    ''' The abstract ``S-Expression`` model
    ''' </summary>
    Public MustInherit Class Expression

        ''' <summary>
        ''' Get the webassembly data type of this expression that will be generated.
        ''' </summary>
        ''' <param name="symbolTable">local/global/function calls</param>
        ''' <returns></returns>
        Public MustOverride Function TypeInfer(symbolTable As SymbolTable) As String
        Public MustOverride Function ToSExpression() As String

        ''' <summary>
        ''' S-Expression debug previews
        ''' </summary>
        ''' <returns></returns>
        Public Overrides Function ToString() As String
            Return ToSExpression()
        End Function

    End Class
End Namespace