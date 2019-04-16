Imports Microsoft.VisualBasic.Emit.Marshal
Imports Microsoft.VisualBasic.Language
Imports Microsoft.VisualBasic.Text

''' <summary>
''' The typescript module definition file to VB.NET module convertor
''' </summary>
Public Class ModuleBuilder

    Dim escape As New Escapes
    Dim buffer As New List(Of Char)

    Public Iterator Function ParseIndex(text As String) As IEnumerable(Of Token)
        Dim code As New Pointer(Of Char)(text.SolveStream)
        Dim c As Value(Of Char) = ""

        Do While (c = ++code) <> ASCII.NUL
            Call walkChar(c)
        Loop
    End Function

    Private Function bufferEquals(test As String) As Boolean
        Return buffer.SequenceEqual(test)
    End Function

    Private Sub walkChar(c As Char)

    End Sub
End Class

Public Class Token

    Public Property Text As String
    Public Property Type As String

End Class

Public Class Escapes

    Public Property SingleLineComment As Boolean
    Public Property BlockTextComment As Boolean

End Class