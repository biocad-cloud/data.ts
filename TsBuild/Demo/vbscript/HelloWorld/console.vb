
''' <summary>
''' The javascript debugconsole api
''' </summary>
Module console

#Region "Javascript console api"

    Declare Function log Lib "console" Alias "log" (message As String) As Integer
    Declare Function warn Lib "console" Alias "warn" (message As String) As Integer
    Declare Function info Lib "console" Alias "info" (message As String) As Integer
    Declare Function [error] Lib "console" Alias "error" (message As String) As Integer

#End Region
End Module
