''' <summary>
''' This code running in webbrowser, working with javascript, not server side.
''' </summary>
Public Module App

    Dim helloWorld As String = "Hello World!"
    Dim note As String = "This message comes from a VisualBasic.NET application!"
    Dim note2 As String = "WebAssembly it works!"

    ''' <summary>
    ''' VB.NET Web frontend programming demo
    ''' </summary>
    Public Sub RunApp()
        Dim textNode = document.DOMById("text")
        Dim notes = document.DOMById("notes")
        Dim message1 = document.createElement("p")
        Dim message2 = document.createElement("p")

        Call document.setText(textNode, helloWorld)
        Call document.setText(message1, note)
        Call document.setText(message2, note2)

        Call document.appendChild(notes, message1)
        Call document.appendChild(notes, message2)

        Call document.setAttribute(notes, "style", "background-color: lightgrey;")
        Call document.setAttribute(message1, "style", "font-size: 2em; color: red;")
        Call document.setAttribute(message2, "style", "font-size: 5em; color: green;")

        ' display text message on javascript console
        Call console.log("Debug text message display below:")

        Call console.warn(note)
        Call console.info(note2)
        Call console.[error]("Try to display an error message on javascript console...")
    End Sub
End Module
