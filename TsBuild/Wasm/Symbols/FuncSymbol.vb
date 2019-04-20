#Region "Microsoft.VisualBasic::988c1214d122615909354546b467c80f, Symbols\FuncSymbol.vb"

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

    '     Class FuncSignature
    ' 
    '         Properties: [Module], IsExtensionMethod, Name, Parameters, Result
    ' 
    '         Constructor: (+2 Overloads) Sub New
    '         Function: ToSExpression, ToString, TypeInfer
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ComponentModel.Collection.Generic
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel.Repository
Imports Microsoft.VisualBasic.Language

Namespace Symbols

    ''' <summary>
    ''' The abstract of the function object, only have function name, parameter and result type definition.
    ''' </summary>
    Public Class FuncSignature : Inherits Expression
        Implements INamedValue
        Implements IDeclaredObject

        ''' <summary>
        ''' 函数在WebAssembly模块内部的引用名称字符串
        ''' </summary>
        ''' <returns></returns>
        Public Property Name As String Implements IKeyedEntity(Of String).Key
        Public Property Parameters As NamedValue(Of String)()

        ''' <summary>
        ''' 函数的返回值类型
        ''' </summary>
        ''' <returns></returns>
        Public Property Result As String

        ''' <summary>
        ''' 当前的这个方法是否是一个被<see cref="ExtensionAttribute"/>所标记的拓展函数
        ''' </summary>
        ''' <returns></returns>
        Public Property IsExtensionMethod As Boolean

        ''' <summary>
        ''' VB module name
        ''' </summary>
        ''' <returns></returns>
        Public Property [Module] As String Implements IDeclaredObject.Module

        Friend Sub New()
        End Sub

        Friend Sub New(var As NamedValue(Of String))
            Name = var.Name
            Result = var.Value
        End Sub

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return Result
        End Function

        Public Overrides Function ToSExpression() As String
            Throw New NotImplementedException()
        End Function

        Public Overrides Function ToString() As String
            With Parameters _
                    .Select(Function(a) $"{a.Name} As {a.Value}") _
                    .JoinBy(", ")

                Return $"Public Function {Name}({ .ByRef}) As {Result}"
            End With
        End Function
    End Class
End Namespace
