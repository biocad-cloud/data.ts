Imports Microsoft.VisualBasic.ComponentModel.Collection
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel

Namespace Symbols.JavaScriptImports

    Public Module Array

        ''' <summary>
        ''' Push element value into a given array and then returns the array intptr
        ''' </summary>
        ''' <returns></returns>
        Public ReadOnly Property PushArray As New ImportSymbol With {
            .ImportObject = "push",
            .Name = "push.array",
            .[Module] = "array",
            .Package = "array",
            .Result = "i32",
            .Parameters = {
                New NamedValue(Of String)("array", "i32"),
                New NamedValue(Of String)("element", "i32")
            }
        }

        ''' <summary>
        ''' Create an new array and then returns the array intptr
        ''' </summary>
        ''' <returns></returns>
        Public ReadOnly Property NewArray As New ImportSymbol With {
            .ImportObject = "new",
            .[Module] = "array",
            .Name = "new.array",
            .Package = "array",
            .Result = "i32",
            .Parameters = {}
        }

        Public ReadOnly Property GetArrayElement As New ImportSymbol With {
            .ImportObject = "get",
            .[Module] = "array",
            .Name = "array.get",
            .Package = "array",
            .Result = "i32",
            .Parameters = {
                New NamedValue(Of String)("array", "i32"),
                New NamedValue(Of String)("index", "i32")
            }
        }

        Public ReadOnly Property SetArrayElement As New ImportSymbol With {
            .ImportObject = "set",
            .[Module] = "array",
            .Name = "array.set",
            .Package = "array",
            .Result = "i32",
            .Parameters = {
                New NamedValue(Of String)("array", "i32"),
                New NamedValue(Of String)("index", "i32"),
                New NamedValue(Of String)("value", "i32")
            }
        }

        Public ReadOnly Property ArrayLength As New ImportSymbol With {
            .ImportObject = "length",
            .[Module] = "array",
            .Name = "array.length",
            .Package = "array",
            .Result = "i32",
            .Parameters = {
                New NamedValue(Of String)("array", "i32")
            }
        }

        ReadOnly arrayOp As Index(Of String) = {GetArrayElement.Name, SetArrayElement.Name}

        Public Function IsArrayOperation(func As FuncSignature) As Boolean
            Return TypeOf func Is ImportSymbol AndAlso func.Name Like arrayOp
        End Function
    End Module
End Namespace