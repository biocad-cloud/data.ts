Imports System.Runtime.CompilerServices

Public Module base64Encoder

    Dim keyStr As String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

    Declare Function regexpReplace Lib "regexp" Alias "replace" (text As String, pattern As Integer, replacement As String) As String
    ''' <summary>
    ''' Create a new regexp pattern object from javascript
    ''' </summary>
    ''' <param name="pattern"></param>
    ''' <returns></returns>
    Declare Function regexp Lib "regexp" Alias "regexp" (pattern As String, Optional flag$ = "g") As Integer
    Declare Function push Lib "array" Alias "push" (array As Array, element As Object) As Integer
    Declare Function fromCharCode Lib "String" Alias "fromCharCode" (c As Integer) As Char

    <Extension>
    Declare Function charCodeAt Lib "String" Alias "CharCodeAt" (text As String, index As Integer) As Integer
    <Extension>
    Declare Function charAt Lib "String" Alias "CharAt" (text As String, index As Integer) As String

    Declare Function isNaN Lib "number" Alias "isNaN" (x As Integer) As Boolean

    <Extension>
    Declare Function Join Lib "String" Alias "Join" (array As IList, delimiter As String) As String

    ''' <summary>
    ''' 将任意文本编码为base64字符串
    ''' </summary>
    ''' <param name="text"></param>
    ''' <returns></returns>
    Public Function encode(text As String) As String
        Dim base64 As List(Of String) = New List(Of String)
        Dim n, r, i, s, o, u, a As Integer
        Dim f = 0

        text = base64Encoder.utf8_encode(text)

        Do While (f < text.Length)
            n = text.charCodeAt(++f)
            r = text.charCodeAt(++f)
            i = text.charCodeAt(++f)
            s = n >> 2
            o = (n And 3) << 4 Or r >> 4
            u = (r And 15) << 2 Or i >> 6
            a = i And 63

            If (isNaN(r)) Then
                a = 64
                u = a
            ElseIf (isNaN(i)) Then
                a = 64
            End If

            base64.Add(keyStr.charAt(s))
            base64.Add(keyStr.charAt(o))
            base64.Add(keyStr.charAt(u))
            base64.Add(keyStr.charAt(a))
        Loop

        Return base64.Join("")
    End Function

    Public Function decode(base64 As String) As String
        Dim text = ""
        Dim n, r, i As Integer
        Dim s, o, u, a As Integer
        Dim f = 0
        Dim symbolsNotallowed As Integer = regexp("[^A-Za-z0-9+/=]", "g")

        base64 = base64.Replace(symbolsNotallowed, "")

        Do While (f < base64.Length)
            s = keyStr.IndexOf(base64.charAt(++f))
            o = keyStr.IndexOf(base64.charAt(++f))
            u = keyStr.IndexOf(base64.charAt(++f))
            a = keyStr.IndexOf(base64.charAt(++f))
            n = s << 2 Or o >> 4
            r = (o And 15) << 4 Or u >> 2
            i = (u And 3) << 6 Or a
            text = text + fromCharCode(n)

            If (u <> 64) Then
                text = text + fromCharCode(r)
            End If
            If (a <> 64) Then
                text = text + fromCharCode(i)
            End If
        Loop

        text = base64Encoder.utf8_decode(text)

        Return text
    End Function


    ''' <summary>
    ''' 将文本转换为utf8编码的文本字符串
    ''' </summary>
    ''' <param name="text"></param>
    ''' <returns></returns>
    Public Function utf8_encode(text As String) As String
        Dim chars As List(Of String) = New List(Of String)

        text = Replace(text, regexp("rn", "g"), "n")

        For n As Integer = 0 To text.Length - 1
            Dim r = charCodeAt(text, n)

            If (r < 128) Then
                chars.Add(fromCharCode(r))
            ElseIf (r > 127 AndAlso r < 2048) Then
                chars.Add(fromCharCode(r >> 6 Or 192))
                chars.Add(fromCharCode(r And 63 Or 128))
            Else
                chars.Add(fromCharCode(r >> 12 Or 224))
                chars.Add(fromCharCode(r >> 6 And 63 Or 128))
                chars.Add(fromCharCode(r And 63 Or 128))
            End If
        Next

        Return chars.Join("")
    End Function

    ''' <summary>
    ''' 将utf8编码的文本转换为原来的文本
    ''' </summary>
    ''' <param name="text"></param>
    ''' <returns></returns>
    Public Function utf8_decode(text As String) As String
        Dim t As List(Of String) = New List(Of String)
        Dim n = 0
        Dim r = 0
        Dim c2 = 0
        Dim c3 = 0

        Do While (n < text.Length)
            r = text.charCodeAt(n)

            If (r < 128) Then
                t.Add(fromCharCode(r))
                n += 1
            ElseIf (r > 191 AndAlso r < 224) Then
                c2 = text.charCodeAt(n + 1)
                t.Add(fromCharCode((r And 31) << 6 Or c2 And 63))
                n += 2
            Else
                c2 = text.charCodeAt(n + 1)
                c3 = text.charCodeAt(n + 2)
                t.Add(fromCharCode((r And 15) << 12 Or (c2 And 63) << 6 Or c3 And 63))
                n += 3
            End If
        Loop

        Return t.Join("")
    End Function
End Module
