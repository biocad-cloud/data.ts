Module boolTest

    Public Declare Function Random Lib "Math" Alias "random" () As Double

    Public Function logical() As Integer
        Dim b As Boolean = Random() >= 0.5

        If b Then
            Return 1
        Else
            Return -100
        End If
    End Function
End Module
