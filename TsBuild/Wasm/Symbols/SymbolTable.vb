#Region "Microsoft.VisualBasic::48969cbf0e1b05beba112ea47b522de0, Symbols\SymbolTable.vb"

    ' Author:
    ' 
    '       xieguigang (I@xieguigang.me)
    '       asuka (evia@lilithaf.me)
    ' 
    ' Copyright (c) 2019 GCModeller Cloud Platform
    ' 
    ' 
    ' MIT License
    ' 
    ' 
    ' Permission is hereby granted, free of charge, to any person obtaining a copy
    ' of this software and associated documentation files (the "Software"), to deal
    ' in the Software without restriction, including without limitation the rights
    ' to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    ' copies of the Software, and to permit persons to whom the Software is
    ' furnished to do so, subject to the following conditions:
    ' 
    ' The above copyright notice and this permission notice shall be included in all
    ' copies or substantial portions of the Software.
    ' 
    ' THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    ' IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    ' FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    ' AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    ' LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    ' OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    ' SOFTWARE.



    ' /********************************************************************************/

    ' Summaries:

    '     Class SymbolTable
    ' 
    '         Properties: CurrentSymbol, memory, NextGuid, Requires
    ' 
    '         Constructor: (+2 Overloads) Sub New
    ' 
    '         Function: AddFunctionDeclares, GetAllGlobals, GetAllImports, GetAllLocals, GetEnumType
    '                   GetFunctionSymbol, GetGlobal, GetObjectSymbol, GetUnderlyingType, HaveEnumType
    '                   IsLocal
    ' 
    '         Sub: AddEnumType, AddGlobal, AddImports, (+2 Overloads) AddLocal, ClearLocals
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.ComponentModel.Collection
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
        Dim enumConstants As New Dictionary(Of String, EnumSymbol)

        ''' <summary>
        ''' 这个内存对象是全局范围内的
        ''' </summary>
        ''' <returns></returns>
        Public Property memory As New Memory

        ''' <summary>
        ''' 当前所进行解析的函数的名称
        ''' </summary>
        ''' <returns></returns>
        Public Property CurrentSymbol As String

        ''' <summary>
        ''' 为了满足基本的变成需求而自动添加的引用符号列表
        ''' </summary>
        ''' <returns></returns>
        Public Property Requires As New Index(Of String)

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

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Sub New(methods As IEnumerable(Of MethodBlockSyntax), enums As EnumSymbol())
            For Each constant In enums
                Call AddEnumType(constant)
            Next

            Call AddFunctionDeclares(methods)
        End Sub

        Friend Sub New(ParamArray locals As DeclareLocal())
            For Each var As DeclareLocal In locals
                Call AddLocal(var)
            Next
        End Sub

        Public Sub AddEnumType(type As EnumSymbol)
            Call enumConstants.Add(type.Name, type)
        End Sub

        Public Function HaveEnumType(type As String) As Boolean
            Return enumConstants.ContainsKey(type)
        End Function

        Public Function GetEnumType(type As String) As EnumSymbol
            Return enumConstants(type)
        End Function

        Public Function AddFunctionDeclares(methods As IEnumerable(Of MethodBlockSyntax)) As SymbolTable
            For Each method In methods
                With method.FuncVariable(Me)
                    functionList(.Name) = New FuncSignature(.ByRef) With {
                        .Parameters = method.ParseParameters(Me)
                    }
                End With
            Next

            Return Me
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Function GetAllImports() As IEnumerable(Of ImportSymbol)
            Return functionList.Values.OfType(Of ImportSymbol)
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Function GetAllGlobals() As IEnumerable(Of DeclareGlobal)
            Return globals.Values
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Function GetAllLocals() As IEnumerable(Of DeclareLocal)
            Return locals.Values
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
        Public Sub AddGlobal(var$, type$, moduleName$, init As LiteralExpression)
            Call globals.Add(var, New DeclareGlobal With {.name = var, .type = type, .init = init, .[Module] = moduleName})
        End Sub

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Sub AddLocal([declare] As NamedValue(Of String))
            Call locals.Add([declare].Name, New DeclareLocal With {.name = [declare].Name, .type = [declare].Value})
        End Sub

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Sub ClearLocals()
            Call locals.Clear()
        End Sub

        ''' <summary>
        ''' 因为VB.NET之中，数组的元素获取和函数调用的语法是一样的，所以假若没有找到目标函数
        ''' 但是在local之中找到了一个数组，则会返回数组元素获取的语法
        ''' </summary>
        ''' <param name="name"></param>
        ''' <returns></returns>
        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Function GetFunctionSymbol(name As String) As FuncSignature
            name = name.Trim("$"c, "["c, "]"c)

            If functionList.ContainsKey(name) Then
                Return functionList(name)
            Else
                If locals.ContainsKey(name) AndAlso locals(name).IsArray Then
                    Return JavaScriptImports.GetArrayElement
                Else
                    Throw New MissingPrimaryKeyException(name)
                End If
            End If
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Function GetObjectSymbol(name As String) As DeclareLocal
            Return locals(name.Trim("$"c))
        End Function

        Public Function GetUnderlyingType(name As String) As String
            If IsLocal(name) Then
                Return GetObjectSymbol(name).type
            Else
                Return GetGlobal(name)
            End If
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Shared Narrowing Operator CType(symbols As SymbolTable) As Memory
            Return symbols.memory
        End Operator
    End Class
End Namespace
