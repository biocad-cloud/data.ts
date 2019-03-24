Imports Microsoft.VisualBasic.Linq
Imports Microsoft.VisualBasic.Text

Public Class ModuleSymbol : Inherits Expression
    Implements Enumeration(Of Expression)

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

    Public Overrides Function ToSExpression() As String
        Return $"(module {Exports.JoinBy(ASCII.LF)} {InternalFunctions.JoinBy(ASCII.LF)})"
    End Function
End Class
