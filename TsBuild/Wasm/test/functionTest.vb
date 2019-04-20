Imports System.Runtime.CompilerServices

Module functionTest

    <Extension>
    Declare Function print Lib "console" Alias "log" (info As String) As Integer

    Public Function extensionFunctiontest()
        Call "345566777777".print
    End Function

    Public Function calls()

        Call Main(obj:=999999, args:="Another string value")
        ' use default
        Call Main()

    End Function

    Public Function Main(Optional args As String = "This is the optional parameter value", Optional obj As Integer = -100)
        Call print(args)
        Call print(obj)
    End Function

End Module
