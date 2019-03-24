Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel

' how it works
' 
' vb source => codeDOM => wast model => wast => wasm

Public Class Types

    Public Shared ReadOnly Property Convert2Wasm As New Dictionary(Of Type, String) From {
        {GetType(Integer), "i32"},
        {GetType(Long), "i64"},
        {GetType(Single), "f32"},
        {GetType(Double), "f64"}
    }

End Class

Public Module Extensions

    <Extension>
    Friend Function param(a As NamedValue(Of String)) As String
        Return $"(param {a.Name} {a.Value})"
    End Function
End Module