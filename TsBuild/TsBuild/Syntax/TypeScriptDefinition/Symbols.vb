Imports System.Xml.Serialization

Public Enum TypeScriptTokens
    undefined = 0
    [declare]
    keyword
    [function]
    functionName
    identifier
    typeName
    funcType
    comment
    constructor
    openStack
    closeStack
End Enum

<XmlType("token")> Public Class Token

    <XmlAttribute("type")> Public Property type As TypeScriptTokens
    <XmlText>
    Public Property text As String

    Public Overrides Function ToString() As String
        Return $"[{type}] {text}"
    End Function

End Class

Public Class Escapes

    Public Property SingleLineComment As Boolean
    Public Property BlockTextComment As Boolean
    Public Property StringContent As Boolean

End Class