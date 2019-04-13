﻿#Region "Microsoft.VisualBasic::00935de7f987a979aa66534af977f4e5, Symbols\Memory\StringSymbol.vb"

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

    '     Class StringSymbol
    ' 
    '         Properties: [string], Length, ptr
    ' 
    '         Function: ToSExpression, TypeInfer
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Namespace Symbols

    ''' <summary>
    ''' 因为wasm不支持字符串，但是支持内存对象，所以字符串使用的是一个i32类型的内存地址来表示
    ''' </summary>
    Public Class StringSymbol : Inherits Expression

        Public Property [string] As String
        Public Property ptr As MemoryPtr

        Public ReadOnly Property Length As Integer
            Get
                Return Strings.Len([string])
            End Get
        End Property

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "i32"
        End Function

        Public Overrides Function ToSExpression() As String
            Return $"(data (i32.const {ptr.Ptr}) ""{[string]}"")"
        End Function
    End Class
End Namespace
