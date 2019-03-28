Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Wasm.Symbols.Parser

Namespace Symbols

    ''' <summary>
    ''' A symbol table for type infer
    ''' </summary>
    Public Class SymbolTable

        Dim functionList As New Dictionary(Of String, FuncSignature)
        Dim locals As New Dictionary(Of String, DeclareLocal)

        ''' <summary>
        ''' 当前所进行解析的函数的名称
        ''' </summary>
        ''' <returns></returns>
        Public Property CurrentSymbol As String

        Sub New(methods As IEnumerable(Of MethodBlockSyntax))
            For Each method In methods
                With method.FuncVariable
                    functionList(.Name) = New FuncSignature(.ByRef) With {
                        .Parameters = method.ParseParameters
                    }
                End With
            Next
        End Sub

        Public Sub AddImports(api As FuncSignature)
            functionList.Add(api.Name, api)
        End Sub

        Public Sub AddLocal([declare] As DeclareLocal)
            Call locals.Add([declare].name, [declare])
        End Sub

        Public Sub AddLocal([declare] As NamedValue(Of String))
            Call locals.Add([declare].Name, New DeclareLocal With {.name = [declare].Name, .type = [declare].Value})
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