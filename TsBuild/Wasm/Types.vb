#Region "Microsoft.VisualBasic::36d765948b133b9097b5cb0a24e4944f, Types.vb"

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

    ' Class Types
    ' 
    '     Properties: Convert2Wasm, Operators, Orders
    ' 
    '     Function: [CDbl], [CInt], [CLng], [CSng], [CType]
    '               Compares, CTypeInvoke, IsInteger, TypeCharWasm
    ' 
    ' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ComponentModel.Collection
Imports Microsoft.VisualBasic.Scripting.SymbolBuilder.VBLanguage
Imports Wasm.Symbols

' how it works
' 
' vb source => codeDOM => wast model => wast => wasm

Public Class Types

    Public Shared ReadOnly Property Orders As String() = {"i32", "f32", "i64", "f64"}

    Public Const stringType$ = "char*"

    ''' <summary>
    ''' Webassembly之中，逻辑值是一个32位整型数
    ''' </summary>
    ''' <returns></returns>
    Public Shared ReadOnly Property Convert2Wasm As New Dictionary(Of Type, String) From {
        {GetType(Boolean), "i32"},   ' True = 1, False = 0
        {GetType(Integer), "i32"},
        {GetType(Long), "i64"},
        {GetType(Single), "f32"},
        {GetType(Double), "f64"},
        {GetType(String), stringType}  ' 实际上这是一个integer类型
    }

    Public Shared ReadOnly Property Operators As New Dictionary(Of String, String) From {
        {"+", "add"},
        {"-", "sub"},
        {"*", "mul"},
        {"/", "div"},
        {"^", "$pow"},
        {"=", "eq"},
        {"<>", "ne"}
    }

    Shared ReadOnly integerType As Index(Of String) = {"i32", "i64"}
    Shared ReadOnly floatType As Index(Of String) = {"f32", "f64"}

    Public Shared Function Compares(type$, op$) As String
        Select Case op
            Case ">"
                If type Like integerType Then
                    Return $"{type}.gt_s"
                Else
                    Return $"{type}.gt"
                End If
            Case ">="
                If type Like integerType Then
                    Return $"{type}.ge_s"
                Else
                    Return $"{type}.ge"
                End If
            Case "<"
                If type Like integerType Then
                    Return $"{type}.lt_s"
                Else
                    Return $"{type}.lt"
                End If
            Case "<="
                If type Like integerType Then
                    Return $"{type}.le_s"
                Else
                    Return $"{type}.le"
                End If
            Case Else
                Throw New NotImplementedException
        End Select
    End Function

    <MethodImpl(MethodImplOptions.AggressiveInlining)>
    Public Shared Function IsInteger(exp As Expression, symbols As SymbolTable) As Boolean
        Return exp.TypeInfer(symbols) Like integerType
    End Function

    ''' <summary>
    ''' ``CType`` operator to webassembly 
    ''' ``Datatype conversions, truncations, reinterpretations, promotions, and demotions`` feature.
    ''' 
    ''' > https://github.com/WebAssembly/design/blob/master/Semantics.md
    ''' </summary>
    ''' <param name="left"></param>
    ''' <returns></returns>
    Public Shared Function [CType](left As String, right As Expression, symbols As SymbolTable) As Expression
        If left = right.TypeInfer(symbols) Then
            Return right
        ElseIf left = stringType AndAlso right.TypeInfer(symbols) = "i32" Then
            Return right
        End If

        Select Case left
            Case "i32"
                Return Types.CInt(right, symbols)
            Case "i64"
                Return Types.CLng(right, symbols)
            Case "f32"
                Return Types.CSng(right, symbols)
            Case "f64"
                Return Types.CDbl(right, symbols)
            Case Else
                Throw New NotImplementedException
        End Select
    End Function

    Public Shared Function [CInt](exp As Expression, symbols As SymbolTable) As Expression
        Dim type = exp.TypeInfer(symbols)
        Dim operator$

        Select Case type
            Case "i32"
                Return exp
            Case "i64"
                [operator] = "i32.wrap/i64"
            Case "f32"
                [operator] = "i32.trunc_s/f32"
            Case "f64"
                [operator] = "i32.trunc_s/f64"
            Case Else
                Throw New NotImplementedException
        End Select

        Return CTypeInvoke([operator], exp)
    End Function

    Public Shared Function [CLng](exp As Expression, symbols As SymbolTable) As Expression
        Dim type = exp.TypeInfer(symbols)
        Dim operator$

        Select Case type
            Case "i32"
                [operator] = "i64.extend_s/i32"
            Case "i64"
                Return exp
            Case "f32"
                [operator] = "i64.trunc_s/f32"
            Case "f64"
                [operator] = "i64.trunc_s/f64"
            Case Else
                Throw New NotImplementedException
        End Select

        Return CTypeInvoke([operator], exp)
    End Function

    Public Shared Function [CSng](exp As Expression, symbols As SymbolTable) As Expression
        Dim type = exp.TypeInfer(symbols)
        Dim operator$

        Select Case type
            Case "i32"
                [operator] = "f32.convert_s/i32"
            Case "i64"
                [operator] = "f32.convert_s/i64"
            Case "f32"
                Return exp
            Case "f64"
                [operator] = "f32.demote/f64"
            Case Else
                Throw New NotImplementedException
        End Select

        Return CTypeInvoke([operator], exp)
    End Function

    Public Shared Function [CDbl](exp As Expression, symbols As SymbolTable) As Expression
        Dim type = exp.TypeInfer(symbols)
        Dim operator$

        Select Case type
            Case "i32"
                [operator] = "f64.convert_s/i32"
            Case "i64"
                [operator] = "f64.convert_s/i64"
            Case "f32"
                [operator] = "f64.promote/f32"
            Case "f64"
                Return exp
            Case Else
                Throw New NotImplementedException
        End Select

        Return CTypeInvoke([operator], exp)
    End Function

    <MethodImpl(MethodImplOptions.AggressiveInlining)>
    Private Shared Function CTypeInvoke(operator$, exp As Expression) As Expression
        Return New FuncInvoke With {
            .Reference = [operator],
            .[operator] = True,
            .Parameters = {exp}
        }
    End Function

    <MethodImpl(MethodImplOptions.AggressiveInlining)>
    Public Shared Function TypeCharWasm(c As Char) As String
        Return Convert2Wasm(Scripting.GetType(Patterns.TypeCharName(c)))
    End Function
End Class
