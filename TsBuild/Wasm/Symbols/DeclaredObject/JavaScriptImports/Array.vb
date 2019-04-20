#Region "Microsoft.VisualBasic::28943064137b6d5bcbf2a5fd91860d60, Symbols\DeclaredObject\JavaScriptImports\Array.vb"

' Author:
' 
'       xieguigang (I@xieguigang.me)
'       asuka (evia@lilithaf.me)
' 
' Copyright (c) 2019 GCModeller Cloud Platform
' 
' 
' MIT License
' 
' 
' Permission is hereby granted, free of charge, to any person obtaining a copy
' of this software and associated documentation files (the "Software"), to deal
' in the Software without restriction, including without limitation the rights
' to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
' copies of the Software, and to permit persons to whom the Software is
' furnished to do so, subject to the following conditions:
' 
' The above copyright notice and this permission notice shall be included in all
' copies or substantial portions of the Software.
' 
' THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
' IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
' FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
' AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
' LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
' OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
' SOFTWARE.



' /********************************************************************************/

' Summaries:

'     Module Array
' 
'         Properties: ArrayLength, GetArrayElement, NewArray, PushArray, SetArrayElement
' 
'         Function: IsArrayOperation
' 
'         Sub: doArrayImports
' 
' 
' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ComponentModel.Collection
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Wasm.Symbols.Parser

Namespace Symbols.JavaScriptImports

    Public Module Array

        ''' <summary>
        ''' Push element value into a given array and then returns the array intptr
        ''' </summary>
        ''' <returns></returns>
        Public ReadOnly Property PushArray As New ImportSymbol With {
            .ImportObject = "push",
            .Name = "array_push",
            .[Module] = "array",
            .Package = NameOf(Array),
            .Result = "i32",
            .Parameters = {
                New NamedValue(Of String)("array", "i32"),
                New NamedValue(Of String)("element", "object")
            }
        }

        ''' <summary>
        ''' Create an new array and then returns the array intptr
        ''' </summary>
        ''' <returns></returns>
        Public ReadOnly Property NewArray As New ImportSymbol With {
            .ImportObject = "create",
            .[Module] = "array",
            .Name = "new_array",
            .Package = NameOf(Array),
            .Result = "i32",
            .Parameters = {}
        }

        Public ReadOnly Property GetArrayElement As New ImportSymbol With {
            .ImportObject = "get",
            .[Module] = "array",
            .Name = "array_get",
            .Package = NameOf(Array),
            .Result = "i32",
            .Parameters = {
                New NamedValue(Of String)("array", "i32"),
                New NamedValue(Of String)("index", "i32")
            }
        }

        Public ReadOnly Property SetArrayElement As New ImportSymbol With {
            .ImportObject = "set",
            .[Module] = "array",
            .Name = "array_set",
            .Package = NameOf(Array),
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
            .Name = "array_length",
            .Package = NameOf(Array),
            .Result = "i32",
            .Parameters = {
                New NamedValue(Of String)("array", "i32")
            }
        }

        ReadOnly arrayOp As Index(Of String) = {GetArrayElement.Name, SetArrayElement.Name}

        Public Function IsArrayOperation(func As FuncSignature) As Boolean
            Return TypeOf func Is ImportSymbol AndAlso func.Name Like arrayOp
        End Function

        <Extension>
        Public Sub doArrayImports(symbols As SymbolTable)
            Call symbols.addRequired(JavaScriptImports.NewArray)
            Call symbols.addRequired(JavaScriptImports.PushArray)
            Call symbols.addRequired(JavaScriptImports.GetArrayElement)
            Call symbols.addRequired(JavaScriptImports.ArrayLength)
        End Sub
    End Module
End Namespace
