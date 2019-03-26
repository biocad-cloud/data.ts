Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.Language
Imports Wasm.Symbols.Parser

Namespace Symbols

    Public Class SymbolTable

        Dim functionList As New Dictionary(Of String, FuncSignature)
        Dim locals As New Dictionary(Of String, DeclareLocal)

        Sub New(methods As IEnumerable(Of MethodBlockSyntax))
            For Each method In methods
                With method.FuncVariable
                    functionList(.Name) = New FuncSignature(.ByRef)
                End With
            Next
        End Sub

        Public Sub AddLocal([declare] As DeclareLocal)
            Call locals.Add([declare].name, [declare])
        End Sub

        Public Sub ClearLocals()
            Call locals.Clear()
        End Sub

        Public Function GetFunctionSymbol(name As String) As FuncSignature
            Return functionList(name.Trim("$"c))
        End Function

        Public Function GetObjectSymbol(name As String) As DeclareLocal
            Return locals(name.Trim("$"c))
        End Function
    End Class
End Namespace