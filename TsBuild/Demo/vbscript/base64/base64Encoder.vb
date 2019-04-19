Imports System.Runtime.CompilerServices

Public Module base64Encoder

    Dim keyStr As String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

    Declare Function regexpReplace Lib "regexp" Alias "replace" (text As String, pattern As Integer, replacement As String) As String
    ''' <summary>
    ''' Create a new regexp pattern object from javascript
    ''' </summary>
    ''' <param name="pattern"></param>
    ''' <returns></returns>
    Declare Function regexp Lib "regexp" Alias "regexp" (pattern As String) As Integer
    Declare Function push Lib "array" Alias "push" (array As Array, element As Object) As Integer
    Declare Function fromCharCode Lib "String" Alias "fromCharCode" (c As Integer) As Char
    Declare Function Join Lib "String" Alias "Join" (array As Array, delimiter As String) As String

    Dim symbolsNotallowed As Integer = regexp("[^A-Za-z0-9+/=]")

    ''' <summary>
    ''' 将utf8编码的文本转换为原来的文本
    ''' </summary>
    ''' <param name="text"></param>
    ''' <returns></returns>
    Public Function utf8_decode(text As String) As String
        Dim t As String() = {}
        Dim n = 0
        Dim r = 0
        Dim c2 = 0
        Dim c3 = 0

        Do While (n < text.Length)
            r = text.charCodeAt(n)

            If (r < 128) Then
                push(t, fromCharCode(r))
                n += 1
            ElseIf (r > 191 AndAlso r < 224) Then
                c2 = text.charCodeAt(n + 1)
                push(t, fromCharCode((r And 31) << 6 Or c2 And 63))
                n += 2
            Else
                c2 = text.charCodeAt(n + 1)
                c3 = text.charCodeAt(n + 2)
                push(t, fromCharCode((r And 15) << 12 Or (c2 And 63) << 6 Or c3 And 63))
                n += 3
            End If
        Loop

        Return Join(t, "")
    End Function

    <Extension>
    Public Function charCodeAt(text As String, n As Integer) As Integer
        Return Asc(text(n))
    End Function
End Module
