Module Stringstest

    ' imports console.log api from javascript
    Public Declare Function Print Lib "console" Alias "log" (text As String) As Integer

    Dim a = 99
    Dim b = 100

    Public Function Main() As String
        Dim str As String = Hello() & " " & World()
        Dim C# = 8888888888888
        Dim format$ = $"let {a} + {b} / {C} = {a + b / C}"

        Call Print(str)
        Call Print(format)

        Return str
    End Function

    Public Function Hello() As String
        Return "Hello"
    End Function

    Public Function World() As String
        Return "World"
    End Function
End Module
