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
        ''' <param name="left"></param>
        ''' <returns></returns>
        Public Function [CType](left As String, right As Expression, symbols As SymbolTable) As Expression
            Select Case left
                Case "i32"
                    Return Types.CInt(right, symbols)
                Case "i64"
                    Return Types.CLng(right, symbols)
                Case "f32"
                    Return Types.CSng(right, symbols)
                Case "f64"
                    Return Types.CDbl(right, symbols)
                Case Else
                    Throw New NotImplementedException
            End Select
        End Function
    End Module
End Namespace