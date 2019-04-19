Module functionTest

    Declare Function print Lib "console" Alias "log" (info As String) As Integer

    Public Sub Main(Optional args As String = "This is the optional parameter value", Optional obj As Integer = -100)
        Call print(args)
    End Sub

    Public Function calls()

        ' use default
        Call Main()
        Call Main(obj:=999999, args:="Another string value")

    End Function
End Module
