#Region "Microsoft.VisualBasic::a6f1a6f090fba232fc63897fa0e53d9f, Types.vb"

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

    ' Class Types
    ' 
    '     Properties: Comparison, Convert2Wasm, Operators, Orders, stringType
    ' 
    '     Function: [CDbl], [CInt], [CLng], [CSng], [CType]
    '               Compares, CTypeInvoke, IsArray, IsInteger, TypeCharWasm
    ' 
    ' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ComponentModel.Collection
Imports Microsoft.VisualBasic.Linq
Imports Microsoft.VisualBasic.Scripting.SymbolBuilder.VBLanguage
Imports Wasm.Symbols
Imports Wasm.Symbols.Parser

' how it works
' 
' vb source => codeDOM => wast model => wast => wasm

Public Class Types

    Public Shared ReadOnly Property Orders As Index(Of String) = {"i32", "f32", "i64", "f64"}

    ''' <summary>
    ''' String type in WebAssembly Compiler
    ''' </summary>
    ''' <returns></returns>
    Public Shared ReadOnly Property stringType As Index(Of String) = {"char*", "char"}

    Public Const booleanType$ = "boolean"

    ''' <summary>
    ''' Webassembly之中，逻辑值是一个32位整型数
    ''' </summary>
    ''' <returns></returns>
    Public Shared ReadOnly Property Convert2Wasm As New Dictionary(Of Type, String) From {
        {GetType(Boolean), booleanType},   ' True = 1, False = 0, 逻辑值在webassembly之中也是一个i32整形数
        {GetType(Integer), "i32"},
        {GetType(Long), "i64"},
        {GetType(Single), "f32"},
        {GetType(Double), "f64"},
        {GetType(String), "char*"}, ' 实际上这是一个integer类型
        {GetType(Char), "char"},
        {GetType(System.Void), "void"}
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

    Public Shared ReadOnly Property Comparison As Index(Of String) = {"f32", "f64", "i32", "i64"} _
        .Select(Function(type)
                    Return {">", ">=", "<", "<="}.Select(Function(op) Compares(type, op))
                End Function) _
        .IteratesALL _
        .ToArray

    ''' <summary>
    ''' 值比较函数返回的是一个整型数
    ''' </summary>
    ''' <param name="type"></param>
    ''' <param name="op"></param>
    ''' <returns></returns>
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
                If type = "i32" Then
                    ' 有一些位相关的操作只能够执行在i32上面
                    Select Case op
                        Case "<<" : Return "i32.shl"
                        Case ">>" : Return "i32.shr_s"
                        Case "And" : Return "i32.and"
                        Case "Or" : Return "i32.or"
                        Case Else
                            Throw New NotImplementedException
                    End Select
                Else
                    Throw New NotImplementedException
                End If
        End Select
    End Function

    <MethodImpl(MethodImplOptions.AggressiveInlining)>
    Public Shared Function IsInteger(exp As Expression, symbols As SymbolTable) As Boolean
        Return exp.TypeInfer(symbols) Like integerType
    End Function

    Public Shared Function IsArray(type As String) As Boolean
        ' instr是从1开始的
        Dim p = InStr(type, "[]") - 1
        Dim lastIndex = (type.Length - 2)

        Return p = lastIndex
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
        Dim rightTypeInfer$ = right.TypeInfer(symbols)
        Dim rightIsI32 As Boolean = rightTypeInfer = "i32"
        Dim isArrayType As Boolean = IsArray(left)

        If left = "object" OrElse left = "any" OrElse left = GetType(Object).FullName Then
            ' 可以传递任意类型给左边
            Return right
        ElseIf left Like stringType AndAlso rightTypeInfer Like stringType Then
            Return right
        End If

        If left = rightTypeInfer Then
            Return right
        ElseIf left Like stringType AndAlso rightIsI32 Then
            Return right
        ElseIf rightTypeInfer Like stringType AndAlso left = "i32" Then
            Return right
        ElseIf left = booleanType AndAlso rightIsI32 Then
            Return right
        ElseIf isArrayType AndAlso TypeOf right Is ArraySymbol Then
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
            Case "char*"
                ' 左边是字符串类型，但是右边不是字符串或者整形数
                ' 则说明是一个需要将目标转换为字符串的操作
                Return right.AnyToString(symbols)
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
