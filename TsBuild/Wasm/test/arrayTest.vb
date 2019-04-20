Module arrayTest

    Declare Function debug Lib "console" Alias "log" (any As String()) As Integer
    Declare Function print Lib "console" Alias "log" (any As String) As Integer

    Public Function createArray()
        Dim str As String() = {"333333", "AAAAA", "XXXXX", "534535", "asdajkfsdhjkf"}
        Dim strAtFirst$ = str(0)

        Call debug(str)
        Call print(str(3))

        str(4) = "Hello world"

        Call debug(str)
        Call print(str(4))
    End Function
End Module
