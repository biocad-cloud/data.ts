Module arrayTest

    Declare Function debug Lib "console" Alias "log" (any As String()) As Integer

    Public Function createArray()
        Dim str As String() = {"333333", "AAAAA", "XXXXX", "534535", "asdajkfsdhjkf"}

        Call debug(str)
    End Function
End Module
