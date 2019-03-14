﻿Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Text

' how it works
' 
' vb source => codeDOM => wast model => wast => wasm

Public Class Types

    Public Shared ReadOnly Property Convert2Wasm As New Dictionary(Of Type, String) From {
        {GetType(Integer), "i32"},
        {GetType(Long), "i64"},
        {GetType(Single), "f32"},
        {GetType(Double), "f64"}
    }

End Class

Public Module Extensions

    <Extension>
    Friend Function param(a As NamedValue(Of String)) As String
        Return $"(param {a.Name} {a.Value})"
    End Function
End Module

Public Class Func : Inherits Expression

    Public Property Name As String
    Public Property Parameters As NamedValue(Of String)()
    Public Property Result As String
    Public Property Body As Expression()

    Public Overrides Function ToSExpression() As String
        Return $"(func {Name} {Parameters.Select(Function(a) a.param).JoinBy(" ")} (result {Result})
    {Body.Select(Function(b) b.ToSExpression).JoinBy(ASCII.LF)}
)"
    End Function
End Class

Public Class FuncInvoke : Inherits Expression

    ''' <summary>
    ''' Function reference string
    ''' </summary>
    ''' <returns></returns>
    Public Property Reference As String
    Public Property Parameters As Expression()

    Public Overrides Function ToSExpression() As String
        Return $"({Reference} {Parameters.Select(Function(a) a.ToSExpression).JoinBy(ASCII.LF)})"
    End Function
End Class

Public Class MethodCall : Inherits FuncInvoke

    Public Overrides Function ToSExpression() As String
        Return $"(call {Reference} {Parameters.Select(Function(a) a.ToSExpression).JoinBy(ASCII.LF)})"
    End Function
End Class

Public MustInherit Class Expression

    Public MustOverride Function ToSExpression() As String

End Class

Public Class LiteralExpression : Inherits Expression

    Public Property type As Type
    Public Property value As Object

    Public Overrides Function ToSExpression() As String
        Return $"{Types.Convert2Wasm(type)}.const {value}"
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

    Public Overrides Function ToSExpression() As String
        Return $"(set_local {var})"
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