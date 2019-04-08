Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Wasm.Symbols.Parser

Namespace Symbols

    ''' <summary>
    ''' A symbol table for type infer
    ''' </summary>
    Public Class SymbolTable

        Dim functionList As New Dictionary(Of String, FuncSignature)
        Dim locals As New Dictionary(Of String, DeclareLocal)
        Dim uid As VBInteger = 666
        ''' <summary>
        ''' [name => type]
        ''' </summary>
        Dim globals As New Dictionary(Of String, DeclareGlobal)

        ''' <summary>
        ''' 当前所进行解析的函数的名称
        ''' </summary>
        ''' <returns></returns>
        Public Property CurrentSymbol As String

        ''' <summary>
        ''' Generate a guid for loop controls
        ''' </summary>
        ''' <returns></returns>
        Public ReadOnly Property NextGuid As String
            <MethodImpl(MethodImplOptions.AggressiveInlining)>
            Get
                Return (++uid).ToHexString
            End Get
        End Property

        Sub New(methods As IEnumerable(Of MethodBlockSyntax))
            For Each method In methods
                With method.FuncVariable
                    functionList(.Name) = New FuncSignature(.ByRef) With {
                        .Parameters = method.ParseParameters
                    }
                End With
            Next
        End Sub

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Function GetAllImports() As IEnumerable(Of ImportSymbol)
            Return functionList.OfType(Of ImportSymbol)
        End Function

        Public Function GetAllGlobals() As IEnumerable(Of DeclareGlobal)
            Return globals.Values
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Sub AddImports(api As FuncSignature)
            functionList.Add(api.Name, api)
        End Sub

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Sub AddLocal([declare] As DeclareLocal)
            Call locals.Add([declare].name, [declare])
        End Sub

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Function IsLocal(var As String) As Boolean
            Return locals.ContainsKey(var)
        End Function

        ''' <summary>
        ''' Get global variable type
        ''' </summary>
        ''' <param name="var"></param>
        ''' <returns></returns>
        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Function GetGlobal(var As String) As String
            Return globals(var).type
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Sub AddGlobal(var$, type$, init As Double)
            Call globals.Add(var, New DeclareGlobal With {.name = var, .type = type})
        End Sub

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Sub AddLocal([declare] As NamedValue(Of String))
            Call locals.Add([declare].Name, New DeclareLocal With {.name = [declare].Name, .type = [declare].Value})
        End Sub

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Sub ClearLocals()
            Call locals.Clear()
        End Sub

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Function GetFunctionSymbol(name As String) As FuncSignature
            Return functionList(name.Trim("$"c))
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Function GetObjectSymbol(name As String) As DeclareLocal
            Return locals(name.Trim("$"c))
        End Function
    End Class
End Namespace