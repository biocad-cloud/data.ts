Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel

Namespace Symbols.JavaScriptImports

    Public Module [String]

        Const stringType$ = "char*"

        Public ReadOnly Property StringAppend As New ImportSymbol With {
            .ImportObject = "add",
            .Name = "string.add",
            .Package = "string",
            .Result = "char*",
            .Parameters = {
                New NamedValue(Of String)("a", stringType),
                New NamedValue(Of String)("b", stringType)
            }
        }

        Public ReadOnly Property StringLength As New ImportSymbol With {
            .ImportObject = "length",
            .[Module] = "string",
            .Name = "string.length",
            .Package = "string",
            .Result = "i32",
            .Parameters = {
                New NamedValue(Of String)("text", stringType)
            }
        }

        Public Function GetStringMethod(name As String) As ImportSymbol
            Select Case name
                Case "Length" : Return StringLength
                Case Else
                    Throw New NotImplementedException
            End Select
        End Function

        ''' <summary>
        ''' 因为WebAssembly没有自动类型转换，所以在这里会需要对每一种数据类型都imports一个相同的函数来完成
        ''' </summary>
        ''' <param name="type"></param>
        ''' <returns></returns>
        Public Function ToString(Optional type As String = "i32") As ImportSymbol
            Return New ImportSymbol With {
                .ImportObject = "toString",
                .Name = $"{type}.toString",
                .Package = "string",
                .Result = stringType,
                .Parameters = {
                    New NamedValue(Of String)("s", type)
                }
            }
        End Function
    End Module
End Namespace