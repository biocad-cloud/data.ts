Imports System.Runtime.CompilerServices

Module stringHelpers

    ''' <summary>
    ''' Create a new regexp pattern object from javascript
    ''' </summary>
    ''' <param name="pattern"></param>
    ''' <returns></returns>
    Declare Function regexp Lib "RegExp" Alias "regexp" (pattern As String, Optional flag$ = "g") As Integer
    Declare Function fromCharCode Lib "string" Alias "fromCharCode" (c As Integer) As Char

    <Extension>
    Declare Function charCodeAt Lib "string" Alias "charCodeAt" (text As String, index As Integer) As Integer
    <Extension>
    Declare Function charAt Lib "string" Alias "charAt" (text As String, index As Integer) As String

    <Extension>
    Declare Function Join Lib "string" Alias "join" (array As IList, delimiter As String) As String

End Module
