Module ForLoopTest

    Public Function forloop() As Double
        Dim x As Double = 999

        For i As Integer = 0 To 100 Step -1
            x += 0.001
        Next

        Return x
    End Function

End Module
