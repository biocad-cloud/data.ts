Module EnumTest

    Public Enum asInteger As Integer
        A = 1
        B
        C
        D
        E
        F
        G
    End Enum

    Public Enum asLong As Long
        A = 1
        B
        C
        E
        D
        F
        G
    End Enum

    Public Function Add1(i As asInteger) As asLong
        Dim x = i + 1
        Dim a = CType(x, asLong)

        Return a
    End Function
End Module
