Module incrementTest

    Public Function runAdd() As Double

        Dim i As Integer = 999

        Call show(++i)

        Dim x = ++i

        Return i
    End Function

    Function show(x As Integer)

    End Function
End Module
