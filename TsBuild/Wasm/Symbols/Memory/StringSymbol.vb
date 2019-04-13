Namespace Symbols

    ''' <summary>
    ''' 因为wasm不支持字符串，但是支持内存对象，所以字符串使用的是一个i32类型的内存地址来表示
    ''' </summary>
    Public Class StringSymbol : Inherits Expression

        Public Property [string] As String
        Public Property ptr As MemoryPtr

        Public ReadOnly Property Length As Integer
            Get
                Return Strings.Len([string])
            End Get
        End Property

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "i32"
        End Function

        Public Overrides Function ToSExpression() As String
            Return $"(data (i32.const {ptr.Ptr}) ""{[string]}"")"
        End Function
    End Class
End Namespace