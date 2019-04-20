#Region "Microsoft.VisualBasic::c8af0259709762483dd415e7525a5fd3, Symbols\DeclaredObject\FuncSymbol.vb"

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

    '     Class FuncSymbol
    ' 
    '         Properties: Body, Locals, VBDeclare
    ' 
    '         Constructor: (+2 Overloads) Sub New
    '         Function: buildBody, ToSExpression, ToString
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Microsoft.VisualBasic.Linq
Imports Microsoft.VisualBasic.Text
Imports Wasm.Symbols.Parser

Namespace Symbols

    ''' <summary>
    ''' Contains function body declare
    ''' </summary>
    Public Class FuncSymbol : Inherits FuncSignature
        Implements IDeclaredObject

        Public Property Body As Expression()
        Public Property Locals As DeclareLocal()

        Public ReadOnly Property VBDeclare As String
            Get
                Return MyBase.ToString
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
                .SafeQuery _
                .Select(Function(v) v.ToSExpression) _
                .ToArray

            For Each line In Me.Body
                body += line.ToSExpression
            Next

            Return declareLocals.JoinBy(ASCII.LF) & ASCII.LF & body.JoinBy(ASCII.LF)
        End Function

        Public Overrides Function ToSExpression() As String
            Dim params$ = Parameters.Select(Function(a) a.param).JoinBy(" ")
            Dim result$ = CTypeParser.typefit(Me.Result)

            If result = "void" Then
                result = ""
            Else
                result = $"(result {result})"
            End If

            Return $"(func ${Name} {params} {result}
    ;; {VBDeclare}
    {buildBody()}
)"
        End Function

        Public Overrides Function ToString() As String
            Return ToSExpression()
        End Function
    End Class
End Namespace
