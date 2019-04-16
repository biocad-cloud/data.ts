Imports Wasm.Symbols.Parser

Namespace Symbols

    ''' <summary>
    ''' 全局变量的初始值，只能够是常数或者其他的全局变量的值，也就是说<see cref="DeclareGlobal.init"/>的值只能够是常数
    ''' </summary>
    Public Class DeclareGlobal : Inherits DeclareVariable
        Implements IDeclaredObject

        ''' <summary>
        ''' The VB module name
        ''' </summary>
        ''' <returns></returns>
        Public Property [Module] As String Implements IDeclaredObject.Module

        Public Overrides Function ToSExpression() As String
            Return $"(global ${name} (mut {CTypeParser.typefit(type)}) {init.ToSExpression})"
        End Function
    End Class
End Namespace