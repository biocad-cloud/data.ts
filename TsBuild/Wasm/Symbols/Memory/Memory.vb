#Region "Microsoft.VisualBasic::3a6ff568ce813cbb0a19aa39f75256a5, Symbols\Memory\Memory.vb"

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

    '     Class Memory
    ' 
    '         Function: AddString, GetEnumerator, IEnumerable_GetEnumerator
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports Microsoft.VisualBasic.Language

Namespace Symbols

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
                .MemoryPtr = offset
            }

            Me.buffer += buffer
            ' 因为字符串末尾会添加一个零，来表示字符串的结束
            ' 所以在长度这里会需要添加1
            Me.offset += buffer.Length + 1

            Return buffer.MemoryPtr
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
