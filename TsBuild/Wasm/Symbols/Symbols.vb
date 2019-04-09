Imports System.Runtime.CompilerServices

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
        Public Property callImports As Boolean

        Public Overrides Function ToSExpression() As String
            Dim arguments = Parameters _
                .Select(Function(a)
                            Return a.ToSExpression
                        End Function) _
                .JoinBy(" ")

            If [operator] Then
                Return $"({Reference} {arguments})"
            ElseIf callImports Then
                Return $"(call_import ${Reference} {arguments})"
            Else
                Return $"(call ${Reference} {arguments})"
            End If
        End Function

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            If [operator] Then
                Return Reference.Split("."c).First
            Else
                Return symbolTable.GetFunctionSymbol(Reference).Result
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
            Return $"({type}.const {value})"
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
            Return symbolTable.GetObjectSymbol(var).type
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
            Return symbolTable.GetObjectSymbol(var).type
        End Function
    End Class

    Public Class GetGlobalVariable : Inherits Expression

        Public Property var As String

        Public Overrides Function ToSExpression() As String
            Return $"(get_global {var})"
        End Function

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return symbolTable.GetObjectSymbol(var).type
        End Function
    End Class

    Public Class SetGlobalVariable : Inherits Expression

        Public Property var As String

        Public Overrides Function ToSExpression() As String
            Return $"(set_global {var})"
        End Function

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return symbolTable.GetObjectSymbol(var).type
        End Function
    End Class

    Public Class DeclareLocal : Inherits DeclareVariable

        Public ReadOnly Property SetLocal As SetLocalVariable
            Get
                Return New SetLocalVariable With {
                    .var = name,
                    .value = init
                }
            End Get
        End Property

        Public Overrides Function ToSExpression() As String
            Return $"(local ${name} {type})"
        End Function

    End Class

    Public MustInherit Class DeclareVariable : Inherits Expression

        Public Property name As String
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

    Public Class DeclareGlobal : Inherits DeclareVariable

        Public Overrides Function ToSExpression() As String
            Return $"(global ${name} (mut {type}) {init.ToSExpression})"
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