Module DeclareTest

    Dim MN As Long = -99, L As Single = 90
    Dim A, B, C As Double, GG As Single, Z&
    Dim E%, F&

    Private Function localDeclareTest() As Single
        Dim MN As Long = -99, L As Single = 90
        Dim A, B, C As Double, GG As Single, Z&
        Dim E%, F&

        Return (MN + L + A + B + C) * GG / Z * E * F
    End Function

End Module
