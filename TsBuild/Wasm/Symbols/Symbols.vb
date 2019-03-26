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
                Throw New NotImplementedException
            Else
                Return symbolTable.GetFunctionSymbol(Reference).Result
            End If
        End Function
    End Class

    Public Class LiteralExpression : Inherits Expression

        Public Property type As String
        Public Property value As String

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

    Public Class DeclareLocal : Inherits Expression

        Public Property name As String
        Public Property type As String
        Public Property init As Expression

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
End Namespace