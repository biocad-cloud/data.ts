''' <summary>
''' This code running in webbrowser, working with javascript, not server side.
''' </summary>
Public Module App

#Region "JavaScript html document Api"

    ' integer type in these imports javascript api is the object memory pointer
    ' in your webbrowser programs' memory

    Declare Function DOMById Lib "document" Alias "getElementById" (id As String) As Integer
    Declare Function setText Lib "document" Alias "writeElementText" (node As Integer, text As String) As Integer
    Declare Function createElement Lib "document" Alias "createElement" (tagName As String) As Integer
    Declare Function setAttribute Lib "document" Alias "setAttribute" (node As Integer, attr As String, value As String) As Integer
    Declare Function appendChild Lib "document" Alias "appendChild" (parent As Integer, node As Integer) As Integer

#End Region

#Region "Javascript console api"

    Declare Function log Lib "console" Alias "log" (message As String) As Integer
    Declare Function warn Lib "console" Alias "warn" (message As String) As Integer
    Declare Function info Lib "console" Alias "info" (message As String) As Integer
    Declare Function [error] Lib "console" Alias "error" (message As String) As Integer

#End Region

    Dim helloWorld As String = "Hello World!"
    Dim note As String = "This message comes from a VisualBasic.NET application!"
    Dim note2 As String = "WebAssembly it works!"

    ''' <summary>
    ''' VB.NET Web frontend programming demo
    ''' </summary>
    ''' <returns></returns>
    Public Function RunApp() As Integer
        Dim textNode = DOMById("text")
        Dim notes = DOMById("notes")
        Dim message1 = createElement("p")
        Dim message2 = createElement("p")

        Call setText(textNode, helloWorld)
        Call setText(message1, note)
        Call setText(message2, note2)

        Call appendChild(notes, message1)
        Call appendChild(notes, message2)

        Call setAttribute(notes, "style", "background-color: lightgrey;")
        Call setAttribute(message1, "style", "font-size: 2em; color: red;")
        Call setAttribute(message2, "style", "font-size: 5em; color: green;")

        ' display text message on javascript console
        Call log("Debug text message display below:")

        Call warn(note)
        Call info(note2)
        Call [error]("Try to display an error message on javascript console...")

        Return 0
    End Function
End Module
