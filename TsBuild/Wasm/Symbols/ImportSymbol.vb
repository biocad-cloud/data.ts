Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel

Namespace Symbols

    ''' <summary>
    ''' Imports object can be parse from the VB.NET ``Declare`` statement
    ''' </summary>
    Public Class ImportSymbol : Inherits FuncSignature

        Public Property Package As String
        Public Property ImportObject As String

        Sub New()
        End Sub

        Sub New(ParamArray args As NamedValue(Of String)())
            Parameters = args
        End Sub

        Public Overrides Function ToSExpression() As String
            Dim params$ = Parameters.Select(Function(a) a.param).JoinBy(" ")

            Return $"(func ${Name} (import ""{Package}"" ""{ImportObject}"") {params} (result {Result}))"
        End Function

        Public Shared ReadOnly Property MathImports As ImportSymbol()
            <MethodImpl(MethodImplOptions.AggressiveInlining)>
            Get
                Return mathImport().ToArray
            End Get
        End Property

        Private Shared Iterator Function mathImport() As IEnumerable(Of ImportSymbol)
            Const Math$ = NameOf(Math)

            Yield New ImportSymbol With {.Package = Math, .ImportObject = "", .Name = "", .Parameters = {}, .Result = ""}
        End Function

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return Result
        End Function
    End Class
End Namespace


