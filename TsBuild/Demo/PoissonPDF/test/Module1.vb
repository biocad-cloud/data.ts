Module Module1

    Sub Main()
        Call Console.WriteLine(PoissonPDF(5, 2.0))
        Call Console.ReadKey()
    End Sub

    Public Function PoissonPDF(k%, lambda As Double) As Double
        Dim result As Double = Math.Exp(-lambda)

        While k >= 1
            result *= lambda / k
            k -= 1
        End While

        Return result
    End Function
End Module
