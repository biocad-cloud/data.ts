Module Strings

    Public Declare Function Print Lib "Console" Alias "WriteLine" (text As String) As Integer

    Public Function Main() As String
        Dim str As String = Hello() & " " & World()

        Call Print(str)

        Return str
    End Function

    Public Function Hello() As String
        Return "Hello"
    End Function

    Public Function World() As String
        Return "World"
    End Function
End Module
