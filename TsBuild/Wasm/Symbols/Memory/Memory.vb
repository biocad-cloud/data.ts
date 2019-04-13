#Region "Microsoft.VisualBasic::6bfe0c7d7160b05d2f7879e6c7bc3e94, Symbols\Memory\Memory.vb"

' Author:
' 
'       xieguigang (I@xieguigang.me)
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

'     Class MemoryPtr
' 
'         Properties: Length, Ptr
' 
'     Class Memory
' 
'         Function: AddString
' 
' 
' /********************************************************************************/

#End Region

Imports Microsoft.VisualBasic.Language

Namespace Symbols

    ''' <summary>
    ''' 内存指针
    ''' </summary>
    Public Class MemoryPtr : Inherits Expression

        ''' <summary>
        ''' 这个内存指针所指向的内存块的起始地址
        ''' </summary>
        ''' <returns></returns>
        Public Property Ptr As Integer
        ''' <summary>
        ''' 所指向的目标内存块的长度
        ''' </summary>
        ''' <returns></returns>
        Public Property Length As Integer

        ''' <summary>
        ''' 这个内存指针在内存之中的起始位置
        ''' </summary>
        ''' <returns></returns>
        Public Property Location As Integer

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "void"
        End Function

        Public Overrides Function ToSExpression() As String
            Return $";; memory pointer
(i32.store (i32.const {Ptr}) (i32.const {Location}))
(i32.store (i32.const {Length}) (i32.const {Location + 4}))"
        End Function
    End Class

    ''' <summary>
    ''' The WebAssembly memory buffer device
    ''' </summary>
    Public Class Memory : Implements IEnumerable(Of Expression)

        Dim buffer As New List(Of Expression)
        Dim offset As Integer = 1

        ''' <summary>
        ''' 函数返回的是数据的内存位置
        ''' </summary>
        ''' <param name="str"></param>
        ''' <returns></returns>
        Public Function AddString(str As String) As Integer
            Dim buffer As New StringSymbol With {
                .[string] = str,
                .ptr = New MemoryPtr With {
                    .Ptr = offset,
                    .Length = Strings.Len(str)
                }
            }

            Me.buffer += buffer
            Me.offset += buffer.ptr.Length

            ' return memory pointer offset start
            Return AddPointer(buffer.ptr)
        End Function

        Public Function AddPointer(ptr As MemoryPtr) As Integer
            Dim p As Integer = offset

            buffer += ptr
            offset += 8
            ptr.Location = p

            Return p
        End Function

        Public Iterator Function GetEnumerator() As IEnumerator(Of Expression) Implements IEnumerable(Of Expression).GetEnumerator
            For Each data As Expression In buffer
                Yield data
            Next
        End Function

        Private Iterator Function IEnumerable_GetEnumerator() As IEnumerator Implements IEnumerable.GetEnumerator
            Yield GetEnumerator()
        End Function
    End Class
End Namespace
