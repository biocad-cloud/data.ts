Public Module Math

    ''' <summary>
    ''' Imports external javascript function with declares
    ''' </summary>
    ''' <param name="x"></param>
    ''' <returns></returns>
    Declare Function Exp Lib "Math" Alias "exp" (x As Double) As Double
    Declare Function Random Lib "Math" Alias "random" () As Double
    ''' <summary>
    ''' An imports javascript api:
    ''' 
    ''' ```javascript
    ''' var DOM = {
    '''     display: Function(x) {
    '''			document.getElementById("text").innerText = x;
    '''		}
    '''	}
    '''	```
    ''' </summary>
    ''' <param name="x"></param>
    ''' <returns></returns>
    Declare Function Display Lib "DOM" Alias "display" (x As Single) As Integer

    Dim global_i As Integer = 990

    Public Function HelloWorld() As String
        Return "Hello world!"
    End Function

    Public Function TextDemo2() As String
        Return "Hello VisualBasic.NET"
    End Function

    ''' <summary>
    ''' Returns the PDF value at <paramref name="k"/> for the specified Poisson distribution.
    ''' </summary>
    ''' <remarks>
    ''' This public method will be export from this module in WebAssembly
    ''' </remarks>
    Public Function PoissonPDF(k%, lambda As Double) As Double
        Dim result As Double = Exp(-lambda)

        While k >= 1
            result *= lambda / k
            k -= 1
        End While

        Return result
    End Function

    Public Function Add10(x As Integer) As Integer
        For i As Integer = 0 To 9
            x += 1
        Next

        global_i += 10

        Return x + global_i * 2
    End Function

    Public Function GetGlobal() As Single
        Return global_i
    End Function

    Public Function FlipCoin() As Double
        Dim r As Double = Random()

        If r >= 0.5 Then
            Return 1 + r
        Else
            Return -1 - r
        End If
    End Function

    Public Function HtmlTest(x As Single) As Double
        Call Display(x)
        Return Add10(x)
    End Function
End Module
