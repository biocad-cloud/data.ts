Imports System.Runtime.CompilerServices

''' <summary>
''' A demo of VB.NET general programming features in WebAssembly
''' 
''' 1. extension function is supported
''' 2. array is supported
''' 3. numeric operators is supported
''' 4. if/for/while control flow is supported
''' 5. string operation is supported
''' </summary>
Public Module base64Encoder

    Dim keyStr As String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

    Declare Function isNaN Lib "Math" Alias "isNaN" (x As Integer) As Boolean
    Declare Sub print Lib "console" Alias "log" (obj As Object)

    ''' <summary>
    ''' 将任意文本编码为base64字符串
    ''' </summary>
    ''' <param name="text"></param>
    ''' <returns></returns>
    Public Function encode(text As String) As String
        Dim base64 As List(Of String) = New List(Of String)
        Dim n, r, i, s, o, u, a As Integer
        Dim f = 0

        text = text.utf8_encode()

        Do While (f < text.Length)
            n = text.charCodeAt(f)
            f += 1
            r = text.charCodeAt(f)
            f += 1
            i = text.charCodeAt(f)
            f += 1
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
            s = keyStr.IndexOf(base64.charAt(f))
            f += 1
            o = keyStr.IndexOf(base64.charAt(f))
            f += 1
            u = keyStr.IndexOf(base64.charAt(f))
            f += 1
            a = keyStr.IndexOf(base64.charAt(f))
            f += 1

            n = s << 2 Or o >> 4
            r = (o And 15) << 4 Or u >> 2
            i = (u And 3) << 6 Or a
            text = text & fromCharCode(n)

            If (u <> 64) Then
                text = text & fromCharCode(r)
            End If
            If (a <> 64) Then
                text = text & fromCharCode(i)
            End If
        Loop

        text = text.utf8_decode()

        Return text
    End Function


    ''' <summary>
    ''' 将文本转换为utf8编码的文本字符串
    ''' </summary>
    ''' <param name="text"></param>
    ''' <returns></returns>
    <Extension> Public Function utf8_encode(text As String) As String
        Dim chars As List(Of String) = New List(Of String)

        text = text.Replace(regexp("rn", "g"), "n")

        For n As Integer = 0 To text.Length - 1
            Dim r = charCodeAt(text, n)

            ' Call print(chars)

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
    <Extension> Public Function utf8_decode(text As String) As String
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
