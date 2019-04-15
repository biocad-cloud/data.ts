Namespace Symbols

    ''' <summary>
    ''' The enum type object model
    ''' </summary>
    Public Class EnumSymbol

        ''' <summary>
        ''' The enum type name
        ''' </summary>
        ''' <returns></returns>
        Public Property Name As String
        ''' <summary>
        ''' WebAssembly Type: i32 or i64
        ''' </summary>
        ''' <returns></returns>
        Public Property type As String

        ''' <summary>
        ''' [member name => value]
        ''' </summary>
        ''' <returns></returns>
        Public Property Members As Dictionary(Of String, String)

        Sub New()

        End Sub

        Public Overrides Function ToString() As String
            Return $"Dim {Name} As {type}"
        End Function
    End Class
End Namespace