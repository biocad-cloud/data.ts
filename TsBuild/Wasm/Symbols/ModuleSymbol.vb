Imports Microsoft.VisualBasic.Linq
Imports Microsoft.VisualBasic.Text

Namespace Symbols

    Public Class ModuleSymbol : Inherits Expression
        Implements Enumeration(Of Expression)

        Public Property InternalFunctions As FuncSymbol()
        Public Property Exports As ExportSymbolExpression()
        Public Property [Imports] As ImportSymbol()

        ''' <summary>
        ''' The module name label
        ''' </summary>
        ''' <returns></returns>
        Public Property LabelName As String

        Public Iterator Function GenericEnumerator() As IEnumerator(Of Expression) Implements Enumeration(Of Expression).GenericEnumerator
            For Each func As FuncSymbol In InternalFunctions
                Yield func
            Next
        End Function

        Public Iterator Function GetEnumerator() As IEnumerator Implements Enumeration(Of Expression).GetEnumerator
            Yield GenericEnumerator()
        End Function

        Public Overrides Function ToSExpression() As String
            Dim import$ = ""
            Dim internal$ = InternalFunctions _
                .JoinBy(ASCII.LF & ASCII.LF) _
                .LineTokens _
                .Select(Function(line) "    " & line) _
                .JoinBy(ASCII.LF)

            If [Imports].IsNullOrEmpty Then
                import = [Imports] _
                    .Select(Function(i) i.ToSExpression) _
                    .JoinBy(ASCII.LF & "    ")
            End If

            Return $"(module ;; Module {LabelName}

    {import}

    {Exports.JoinBy(ASCII.LF & "    ")} 

{internal}

)"
        End Function
    End Class
End Namespace