Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel

Namespace Symbols.JavaScriptImports

    ''' <summary>
    ''' Some auto imports javascript API that required for implements VB programming.
    ''' </summary>
    Friend NotInheritable Class NamespaceDoc
        Private Sub New()
        End Sub
    End Class

    Public Module Math

    End Module

    Public Module [String]

        Public ReadOnly Property Concatenation As New ImportSymbol With {
            .ImportObject = "add",
            .Name = "string.add",
            .Package = "string",
            .Result = "char*",
            .Parameters = {
                New NamedValue(Of String)("a", "char*"),
                New NamedValue(Of String)("b", "char*")
            }
        }

        ''' <summary>
        ''' 因为WebAssembly没有自动类型转换，所以在这里会需要对每一种数据类型都imports一个相同的函数来完成
        ''' </summary>
        ''' <param name="type"></param>
        ''' <returns></returns>
        Public ReadOnly Property JsObjectToString(Optional type As String = "i32") As ImportSymbol
            Get
                Return New ImportSymbol With {
                    .ImportObject = "toString",
                    .Name = $"{type}.toString",
                    .Package = "string",
                    .Result = "char*",
                    .Parameters = {
                        New NamedValue(Of String)("s", type)
                    }
                }
            End Get
        End Property
    End Module
End Namespace