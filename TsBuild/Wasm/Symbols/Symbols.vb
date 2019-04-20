#Region "Microsoft.VisualBasic::41d17fcc9f62acbfe29da2b80a22e951, Symbols\Symbols.vb"

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

    '     Class FuncInvoke
    ' 
    '         Properties: [operator], Parameters, Reference
    ' 
    '         Constructor: (+2 Overloads) Sub New
    '         Function: ToSExpression, TypeInfer
    ' 
    '     Class CommentText
    ' 
    '         Properties: Text
    ' 
    '         Function: ToSExpression, TypeInfer
    ' 
    '     Class LiteralExpression
    ' 
    '         Properties: Sign, type, value
    ' 
    '         Constructor: (+2 Overloads) Sub New
    '         Function: ToSExpression, TypeInfer
    ' 
    '     Class GetLocalVariable
    ' 
    '         Properties: var
    ' 
    '         Constructor: (+1 Overloads) Sub New
    '         Function: ToSExpression, TypeInfer
    ' 
    '     Class SetLocalVariable
    ' 
    '         Properties: value, var
    ' 
    '         Function: ToSExpression, TypeInfer
    ' 
    '     Class GetGlobalVariable
    ' 
    '         Properties: var
    ' 
    '         Constructor: (+2 Overloads) Sub New
    '         Function: ToSExpression, TypeInfer
    ' 
    '     Class SetGlobalVariable
    ' 
    '         Function: ToSExpression, TypeInfer
    ' 
    '     Class DeclareLocal
    ' 
    '         Properties: IsArray, SetLocal
    ' 
    '         Function: ToSExpression
    ' 
    '     Class DeclareVariable
    ' 
    '         Properties: init, name, type
    ' 
    '         Function: TypeInfer
    ' 
    '     Class Parenthesized
    ' 
    '         Properties: Internal
    ' 
    '         Function: ToSExpression, TypeInfer
    ' 
    '     Class ReturnValue
    ' 
    '         Function: ToSExpression
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ComponentModel.Collection.Generic
Imports Wasm.Symbols.Parser

Namespace Symbols

    ''' <summary>
    ''' 一般的函数调用表达式，也包括运算符运算
    ''' </summary>
    Public Class FuncInvoke : Inherits Expression

        ''' <summary>
        ''' Function reference string
        ''' </summary>
        ''' <returns></returns>
        Public Property Reference As String
        Public Property Parameters As Expression()
        Public Property [operator] As Boolean

        Sub New()
        End Sub

        Sub New(funcName As String)
            Reference = funcName
        End Sub

        Public Overrides Function ToSExpression() As String
            Dim arguments = Parameters _
                .Select(Function(a)
                            Return a.ToSExpression
                        End Function) _
                .JoinBy(" ")

            If [operator] Then
                Return $"({Reference} {arguments})"
            Else
                Return $"(call ${Reference} {arguments})"
            End If
        End Function

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            If [operator] Then
                If Reference Like Types.Comparison Then
                    ' WebAssembly comparison operator produce integer value
                    Return "i32"
                Else
                    Return Reference.Split("."c).First
                End If
            Else
                Dim func As FuncSignature

                If Parameters.IsNullOrEmpty Then
                    func = symbolTable.GetFunctionSymbol(Nothing, Reference)
                Else
                    func = symbolTable.GetFunctionSymbol(Parameters(Scan0).TypeInfer(symbolTable), Reference)
                End If

                Return func.Result
            End If
        End Function
    End Class

    Public Class CommentText : Inherits Expression

        Public Property Text As String

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "void"
        End Function

        Public Overrides Function ToSExpression() As String
            Return ";; " & Text
        End Function
    End Class
    Public Class LiteralExpression : Inherits Expression

        Public Property type As String
        Public Property value As String

        Public ReadOnly Property Sign As Integer
            Get
                Return Math.Sign(Val(type))
            End Get
        End Property

        Sub New()
        End Sub

        Sub New(value$, type$)
            Me.type = type
            Me.value = value
        End Sub

        Public Overrides Function ToSExpression() As String
            Return $"({typefit(type)}.const {value})"
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return type
        End Function
    End Class

    Public Class GetLocalVariable : Inherits Expression

        Public Property var As String

        Sub New(Optional ref As String = Nothing)
            var = ref
        End Sub

        Public Overrides Function ToSExpression() As String
            Return $"(get_local ${var})"
        End Function

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            If symbolTable Is Nothing Then
                Return "i32"
            Else
                Return symbolTable.GetObjectSymbol(var).type
            End If
        End Function
    End Class

    Public Class SetLocalVariable : Inherits Expression

        Public Property var As String
        Public Property value As Expression

        Public Overrides Function ToSExpression() As String
            If TypeOf value Is FuncInvoke Then
                Return $"(set_local ${var} {value})"
            Else
                Return $"(set_local ${var} {value})"
            End If
        End Function

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "void"
        End Function
    End Class

    Public Class GetGlobalVariable : Inherits Expression

        Public Property var As String

        Sub New()
        End Sub

        Sub New(name As String)
            var = name
        End Sub

        Public Overrides Function ToSExpression() As String
            Return $"(get_global ${var})"
        End Function

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return symbolTable.GetGlobal(var)
        End Function
    End Class

    Public Class SetGlobalVariable : Inherits SetLocalVariable

        Public Overrides Function ToSExpression() As String
            Return $"(set_global ${var} {value})"
        End Function

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "void"
        End Function
    End Class

    Public Class DeclareLocal : Inherits DeclareVariable

        ''' <summary>
        ''' 对这个变量进行初始值设置
        ''' </summary>
        ''' <returns></returns>
        Public ReadOnly Property SetLocal As SetLocalVariable
            Get
                Return New SetLocalVariable With {
                    .var = name,
                    .value = init
                }
            End Get
        End Property

        Public ReadOnly Property IsArray As Boolean
            <MethodImpl(MethodImplOptions.AggressiveInlining)>
            Get
                Return Types.IsArray(type)
            End Get
        End Property

        Public Overrides Function ToSExpression() As String
            Return $"(local ${name} {typefit(type)})"
        End Function

    End Class

    Public MustInherit Class DeclareVariable : Inherits Expression
        Implements INamedValue

        Public Property name As String Implements INamedValue.Key
        Public Property type As String
        ''' <summary>
        ''' 初始值，对于全局变量而言，则必须要有一个初始值，全局变量默认的初始值为零
        ''' </summary>
        ''' <returns></returns>
        Public Property init As Expression

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return type
        End Function
    End Class

    Public Class Parenthesized : Inherits Expression

        Public Property Internal As Expression

        Public Overrides Function ToSExpression() As String
            Return $"{Internal}"
        End Function

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return Internal.TypeInfer(symbolTable)
        End Function
    End Class

    Public Class ReturnValue : Inherits Parenthesized

        Public Overrides Function ToSExpression() As String
            Return $"(return {Internal.ToSExpression})"
        End Function
    End Class
End Namespace
