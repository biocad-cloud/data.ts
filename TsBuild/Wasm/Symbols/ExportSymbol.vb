#Region "Microsoft.VisualBasic::1895c7027c00ecf7afd8c226a82a6c28, Symbols\ExportSymbol.vb"

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

    '     Class ExportSymbolExpression
    ' 
    '         Properties: [Module], Name, target, type
    ' 
    '         Function: ToSExpression, TypeInfer
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel.Repository

Namespace Symbols

    Public Class ExportSymbolExpression : Inherits Expression
        Implements IDeclaredObject

        ''' <summary>
        ''' 在对象进行导出的时候对外的名称
        ''' </summary>
        ''' <returns></returns>
        Public Property Name As String
        ''' <summary>
        ''' 导出对象的类型，一般为``func``函数类型
        ''' </summary>
        ''' <returns></returns>
        Public Property type As String
        ''' <summary>
        ''' 目标对象在模块内部的引用名称
        ''' </summary>
        ''' <returns></returns>
        Public Property target As String Implements IKeyedEntity(Of String).Key
        Public Property [Module] As String Implements IDeclaredObject.Module

        Public Overrides Function ToSExpression() As String
            Return $"(export ""{Name}"" ({type} ${target}))"
        End Function

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            If type = "func" Then
                Return symbolTable.GetFunctionSymbol(Nothing, target).Result
            Else
                Throw New NotImplementedException
            End If
        End Function
    End Class
End Namespace
