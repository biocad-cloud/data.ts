Public Module ModuleDocument

    ''' <summary>
    ''' ``document.getElementById`` api from javascript runtime
    ''' </summary>
    ''' <param name="id"></param>
    ''' <returns></returns>
    Public Declare Function DOMById Lib "document" Alias "getElementById" (id As String) As Integer
    Public Declare Function WriteText Lib "document" Alias "writeElementText" (dom As Integer, text As String) As Integer

    ''' <summary>
    ''' A demo code that display ``hello world`` on a html node which its id is ``text``
    ''' </summary>
    ''' <returns></returns>
    Public Function sayHello() As String
        Dim text As String = "Hello world!"
        Dim node = DOMById("text")

        Call WriteText(node, text)

        Return text
    End Function

End Module
