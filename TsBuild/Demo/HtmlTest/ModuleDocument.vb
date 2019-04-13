Public Module ModuleDocument

    Public Declare Function DOMById Lib "document" Alias "getElementById" (id As String) As Integer
    Public Declare Function WriteText Lib "document" Alias "writeElementText" (dom As Integer, text As String) As Integer

    Public Function sayHello() As String
        Dim text As String = "Hello world!"
        Dim node = DOMById("text")

        Call WriteText(node, text)

        Return text
    End Function

End Module
