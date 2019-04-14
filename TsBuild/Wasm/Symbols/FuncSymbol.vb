﻿#Region "Microsoft.VisualBasic::8992291da2548fed493addd89578fb39, Symbols\FuncSymbol.vb"

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

'     Class FuncSignature
' 
'         Properties: Name, Parameters, Result
' 
'         Constructor: (+2 Overloads) Sub New
'         Function: ToSExpression, TypeInfer
' 
'     Class FuncSymbol
' 
'         Properties: Body, Locals, VBDeclare
' 
'         Constructor: (+2 Overloads) Sub New
'         Function: buildBody, ToSExpression
' 
' 
' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Microsoft.VisualBasic.Text

Namespace Symbols

    ''' <summary>
    ''' The abstract of the function object, only have function name, parameter and result type definition.
    ''' </summary>
    Public Class FuncSignature : Inherits Expression

        Public Property Name As String
        Public Property Parameters As NamedValue(Of String)()

        ''' <summary>
        ''' 函数的返回值类型
        ''' </summary>
        ''' <returns></returns>
        Public Property Result As String

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
    End Class

    ''' <summary>
    ''' Contains function body declare
    ''' </summary>
    Public Class FuncSymbol : Inherits FuncSignature

        Public Property Body As Expression()
        Public Property Locals As DeclareLocal()

        Public ReadOnly Property VBDeclare As String
            Get
                With Parameters _
                    .Select(Function(a) $"{a.Name} As {a.Value}") _
                    .JoinBy(", ")

                    Return $"Public Function {Name}({ .ByRef}) As {Result}"
                End With
            End Get
        End Property

        Sub New()
        End Sub

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Friend Sub New(funcVar As NamedValue(Of String))
            Call MyBase.New(funcVar)
        End Sub

        ''' <summary>
        ''' 因为webassembly只允许变量必须要定义在最开始的位置
        ''' 所以构建函数体的时候流程会有些复杂
        ''' </summary>
        ''' <returns></returns>
        Private Function buildBody() As String
            ' 先声明变量，然后再逐步赋值
            Dim declareLocals$()
            Dim body As New List(Of String)

            declareLocals = Locals _
                .Select(Function(v) v.ToSExpression) _
                .ToArray

            For Each line In Me.Body
                body += line.ToSExpression
            Next

            Return declareLocals.JoinBy(ASCII.LF) & ASCII.LF & body.JoinBy(ASCII.LF)
        End Function

        Public Overrides Function ToSExpression() As String
            Dim params$ = Parameters.Select(Function(a) a.param).JoinBy(" ")
            Dim result$ = Me.Result Or "i32".When(Me.Result Like Types.stringType)

            Return $"(func ${Name} {params} (result {result})
    ;; {VBDeclare}
    {buildBody()}
)"
        End Function
    End Class
End Namespace
