Imports Microsoft.VisualBasic.ComponentModel.Collection.Generic

Namespace Symbols

    ''' <summary>
    ''' 这个接口对象主要是为构建多个模块组成的应用程序所使用的
    ''' </summary>
    Public Interface IDeclaredObject : Inherits INamedValue

        ''' <summary>
        ''' The package/module name
        ''' </summary>
        ''' <returns></returns>
        Property [Module] As String

    End Interface
End Namespace