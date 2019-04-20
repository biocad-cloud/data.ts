Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax

Namespace Symbols.Parser

    Module AttributeParser

        <Extension>
        Public Function IsExtensionMethod(method As MethodBaseSyntax) As Boolean
            Dim attrs = method.AttributeLists.ToArray

            For Each group As AttributeListSyntax In attrs
                For Each attr In group.Attributes
                    If DirectCast(attr.Name, IdentifierNameSyntax).objectName = "Extension" Then
                        Return True
                    End If
                Next
            Next

            Return False
        End Function
    End Module
End Namespace