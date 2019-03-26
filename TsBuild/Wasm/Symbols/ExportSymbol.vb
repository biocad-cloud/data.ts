Namespace Symbols

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
            Return $"(export ""{Name}"" ({type} ${target}))"
        End Function
    End Class
End Namespace