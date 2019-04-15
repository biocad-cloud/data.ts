Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.Language
Imports Wasm.Symbols.Parser

Namespace Symbols

    ''' <summary>
    ''' The enum type object model
    ''' </summary>
    Public Class EnumSymbol

        ''' <summary>
        ''' The enum type name
        ''' </summary>
        ''' <returns></returns>
        Public Property Name As String
        ''' <summary>
        ''' WebAssembly Type: i32 or i64
        ''' </summary>
        ''' <returns></returns>
        Public Property type As String

        ''' <summary>
        ''' [member name => value]
        ''' </summary>
        ''' <returns></returns>
        Public Property Members As New Dictionary(Of String, String)

        Public ReadOnly Property UnderlyingType As Type
            Get
                If type = "i32" Then
                    Return GetType(Integer)
                Else
                    Return GetType(Long)
                End If
            End Get
        End Property

        Sub New(constants As EnumBlockSyntax)
            With constants.EnumStatement
                Name = .Identifier.objectName

                If .UnderlyingType Is Nothing Then
                    type = "i32"
                Else
                    type = Types.Convert2Wasm(AsTypeHandler.GetAsType(.UnderlyingType, Nothing))
                End If
            End With

            Dim last As Long = 0
            Dim memberName$
            Dim value As String

            For Each member As EnumMemberDeclarationSyntax In constants.Members
                memberName = member.Identifier.objectName

                If member.Initializer Is Nothing Then
                    value = last
                    last += 1
                Else
                    value = member.Initializer.Value.ToString
                    last = value + 1
                End If

                Members.Add(memberName, value)
            Next
        End Sub

        Public Overrides Function ToString() As String
            Return $"Dim {Name} As {type}"
        End Function
    End Class
End Namespace