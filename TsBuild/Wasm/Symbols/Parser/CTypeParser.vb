Namespace Symbols.Parser

    ''' <summary>
    ''' ``CType`` operator to webassembly 
    ''' ``Datatype conversions, truncations, reinterpretations, promotions, and demotions`` 
    ''' feature.
    ''' </summary>
    Module CTypeParser

        ''' <summary>
        ''' https://github.com/WebAssembly/design/blob/master/Semantics.md
        ''' </summary>
        ''' <param name="from"></param>
        ''' <param name="[to]"></param>
        ''' <returns></returns>
        Public Function [CType](from As Type, [to] As Type) As FuncInvoke
            If from Is GetType(Integer) Then
                Return CTypeParser.FromInt32([to])
            Else
                Throw New NotImplementedException(from.FullName)
            End If
        End Function

        Public Function FromInt32([to] As Type) As FuncInvoke
            Select Case [to]
                Case GetType(Byte)
                Case GetType(Short)

            End Select
        End Function
    End Module
End Namespace