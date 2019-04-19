#Region "Microsoft.VisualBasic::f092648918183d2cb2f12135d171e695, Symbols\Blocks\BooleanSymbol.vb"

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

    '     Class BooleanSymbol
    ' 
    '         Properties: [IsNot], Condition
    ' 
    '         Function: BinaryCompares, ToSExpression, TypeInfer
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Wasm.Symbols.Parser

Namespace Symbols.Blocks

    ''' <summary>
    ''' 构建生成逻辑表达式的模型
    ''' </summary>
    Public Class BooleanSymbol : Inherits Expression

        Public Property Condition As Expression
        Public Property [IsNot] As Boolean

        ''' <summary>
        ''' 
        ''' </summary>
        ''' <param name="symbolTable"></param>
        ''' <returns></returns>
        ''' 
        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "i32"
        End Function

        Public Overrides Function ToSExpression() As String
            Dim test$ = Condition.ToSExpression

            If [IsNot] Then
                Return $"(i32.eqz {test})"
            Else
                Return test
            End If
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Shared Function BinaryCompares(left As Expression, right As Expression, op$, symbols As SymbolTable) As BooleanSymbol
            Return New BooleanSymbol With {
                .Condition = ExpressionParse.BinaryStack(left, right, op, symbols)
            }
        End Function

        ''' <summary>
        ''' 逻辑值操作主要是数学关系操作符判断
        ''' </summary>
        ''' <param name="op"></param>
        ''' <returns></returns>
        ''' 
        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Shared Widening Operator CType(op As FuncInvoke) As BooleanSymbol
            Return New BooleanSymbol With {.Condition = op}
        End Operator
    End Class
End Namespace
