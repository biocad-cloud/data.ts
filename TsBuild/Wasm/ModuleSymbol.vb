Imports Microsoft.VisualBasic.Linq

Public Class ModuleSymbol : Implements Enumeration(Of Expression)

    Public Property InternalFunctions As Func()
    Public Property Exports As ExportSymbolExpression()
    ''' <summary>
    ''' The module name label
    ''' </summary>
    ''' <returns></returns>
    Public Property LabelName As String

    Public Iterator Function GenericEnumerator() As IEnumerator(Of Expression) Implements Enumeration(Of Expression).GenericEnumerator
        For Each func As Func In InternalFunctions
            Yield func
        Next
    End Function

    Public Iterator Function GetEnumerator() As IEnumerator Implements Enumeration(Of Expression).GetEnumerator
        Yield GenericEnumerator()
    End Function
End Class
