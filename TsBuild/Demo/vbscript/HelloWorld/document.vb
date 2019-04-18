
''' <summary>
''' The javascript html document api
''' </summary>
Module document

#Region "JavaScript html document Api"

    ' integer type in these imports javascript api is the object memory pointer
    ' in your webbrowser programs' memory

    Declare Function DOMById Lib "document" Alias "getElementById" (id As String) As Integer
    Declare Function setText Lib "document" Alias "writeElementText" (node As Integer, text As String) As Integer
    Declare Function createElement Lib "document" Alias "createElement" (tagName As String) As Integer
    Declare Function setAttribute Lib "document" Alias "setAttribute" (node As Integer, attr As String, value As String) As Integer
    Declare Function appendChild Lib "document" Alias "appendChild" (parent As Integer, node As Integer) As Integer

#End Region
End Module
