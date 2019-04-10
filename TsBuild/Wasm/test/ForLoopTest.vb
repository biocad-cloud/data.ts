Module ForLoopTest

    Public Function forloop() As Double
        Dim x As Double = 999

        For i As Integer = 0 To 100 Step 2
            x += 0.01
        Next

        Return x
    End Function

End Module
