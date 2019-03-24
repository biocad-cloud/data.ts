Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Linq
Imports Microsoft.VisualBasic.Text

Public Class Func : Inherits Expression

    Public Property Name As String
    Public Property Parameters As NamedValue(Of String)()
    Public Property Result As String
    Public Property Body As Expression()

    Public Overrides Function ToSExpression() As String
        Return $"(func {Name} {Parameters.Select(Function(a) a.param).JoinBy(" ")} (result {Result})
    {Body.SafeQuery.Select(Function(b) b.ToSExpression).JoinBy(ASCII.LF & "    ")}
)"
    End Function
End Class

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

    Public Overrides Function ToSExpression() As String
        Return $"({Reference} {Parameters.Select(Function(a) a.ToSExpression).JoinBy(" ")})"
    End Function
End Class

Public Class MethodCall : Inherits FuncInvoke

    Public Overrides Function ToSExpression() As String
        Return $"(call {Reference} {Parameters.Select(Function(a) a.ToSExpression).JoinBy(" ")})"
    End Function
End Class

Public MustInherit Class Expression

    Public MustOverride Function ToSExpression() As String

    Public Overrides Function ToString() As String
        Return ToSExpression()
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
        Return $"(set_local {var} ({value}))"
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
        Return $"$ParenthesizedStack {Internal}"
    End Function
End Class

Public Class ExportSymbolExpression : Inherits Expression

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
    Public Property target As String

    Public Overrides Function ToSExpression() As String
        Return $"(export ""{Name}"" ({type} {target}))"
    End Function
End Class