Module nullreferenceTest

    Declare Function DOMbyId Lib "document" Alias "getElementById" (id As String) As Integer
    Declare Function setAttr Lib "document" Alias "setAttribute" (node As Integer, name As String, value As String) As Integer

    Public Sub noReturns()

    End Sub

    Public Function test() As Integer
        Dim node = DOMbyId("test")

        Call setAttr(node, "a", "b")
        ' Nothing means i32 pointer value is zero
        Call setAttr(Nothing, "a", "b")

        Return 0
    End Function

End Module
