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
                Return $"(call_import {Reference} {arguments})"
            Else
                Return $"(call {Reference} {arguments})"
            End If
        End Function
    End Class

    Public Class LiteralExpression : Inherits Expression

        Public Property type As Type
        Public Property value As String

        Public Overrides Function ToSExpression() As String
            Return $"({Types.Convert2Wasm(type)}.const {value})"
        End Function
    End Class

    Public Class GetLocalVariable : Inherits Expression

        Public Property var As String

        Public Overrides Function ToSExpression() As String
            Return $"(get_local {var})"
        End Function
    End Class

    Public Class SetLocalVariable : Inherits Expression

        Public Property var As String
        Public Property value As Expression

        Public Overrides Function ToSExpression() As String
            If TypeOf value Is FuncInvoke Then
                Return $"(set_local {var} {value})"
            Else
                Return $"(set_local {var} {value})"
            End If
        End Function
    End Class

    Public Class GetGlobalVariable : Inherits Expression

        Public Property var As String

        Public Overrides Function ToSExpression() As String
            Return $"(get_global {var})"
        End Function
    End Class

    Public Class SetGlobalVariable : Inherits Expression

        Public Property var As String

        Public Overrides Function ToSExpression() As String
            Return $"(set_global {var})"
        End Function
    End Class

    Public Class DeclareLocal : Inherits Expression

        Public Property name As String
        Public Property type As String
        Public Property init As Expression

        Public Overrides Function ToSExpression() As String
            If init Is Nothing Then
                Return $"(local {name} {type})"
            Else
                Return $"(local {name} {type}) 
{New SetLocalVariable With {.var = name, .value = init}.ToSExpression}"
            End If
        End Function
    End Class

    Public Class Parenthesized : Inherits Expression

        Public Property Internal As Expression

        Public Overrides Function ToSExpression() As String
            Return $"{Internal}"
        End Function
    End Class
End Namespace