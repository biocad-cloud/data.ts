Module Math

    ''' <summary>
    ''' Imports external javascript function with declares
    ''' </summary>
    ''' <param name="x"></param>
    ''' <returns></returns>
    Declare Function Exp Lib "Math" Alias "exp" (x As Double) As Double

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

    Public Function DisplayResult(k%, lambda#, fontsize As String, background$) As Integer
        Dim pdf As Double = PoissonPDF(k, lambda)

        Call console.warn(fontsize)

        ' display javascript object in debug console 
        Call console.log(document.DOMById("result"))

        Call document.setText(document.DOMById("result"), $"The calculation result of PoissonPDF({k}, {lambda}) is {pdf}!")
        Call document.setAttribute(document.DOMById("result"), "style", $"color: blue; font-size: {fontsize}; background-color: {background};")

        Return 0
    End Function
End Module
