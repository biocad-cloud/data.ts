#Region "Microsoft.VisualBasic::8c7d39059562fbc46e19e5547d638e2f, Extensions.vb"

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

' Module Extensions
' 
'     Function: CreateModule, (+2 Overloads) CreateModuleFromProject, isExportObject, (+3 Overloads) objectName, param
'               SolveStream
' 
' /********************************************************************************/

#End Region

Imports System.IO
Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis
Imports Microsoft.CodeAnalysis.VisualBasic
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.ApplicationServices.Development
Imports Microsoft.VisualBasic.ApplicationServices.Development.VisualStudio
Imports Microsoft.VisualBasic.ComponentModel
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Wasm.Symbols
Imports Wasm.Symbols.Parser
Imports Vbproj = Microsoft.VisualBasic.ApplicationServices.Development.VisualStudio.Project

Public Module Extensions

    ''' <summary>
    ''' Create a WebAssembly module from vb project. 
    ''' </summary>
    ''' <param name="vbproj"></param>
    ''' <returns></returns>
    ''' 
    <MethodImpl(MethodImplOptions.AggressiveInlining)>
    Public Function CreateModuleFromProject(vbproj As String) As ModuleSymbol
        Return vbproj.LoadXml(Of Vbproj).CreateModuleFromProject
    End Function

    <Extension>
    Public Function CreateModuleFromProject(vbproj As Vbproj) As ModuleSymbol
        Dim sourcefiles = vbproj _
            .EnumerateSourceFiles(skipAssmInfo:=True) _
            .ToArray
        Dim assemblyInfo As AssemblyInfo = vbproj.AssemblyInfo
        Dim symbols As SymbolTable = Nothing
        Dim project As New ModuleSymbol
        Dim dir As String = DirectCast(vbproj, IFileReference) _
            .FilePath _
            .ParentPath
        Dim part As ModuleSymbol
        Dim vbcodes As New List(Of ModuleBlockSyntax)
        Dim vbcode As CompilationUnitSyntax

        ' 在刚开始的时候应该将函数的申明全部进行解析
        ' 然后再解析函数体的时候才不会出现没有找到符号的问题
        For Each file As String In sourcefiles
            file = $"{dir}/{file}"
            vbcode = VisualBasicSyntaxTree.ParseText(file.SolveStream).GetRoot

            For Each modulePart As ModuleBlockSyntax In vbcode.Members.OfType(Of ModuleBlockSyntax)
                vbcodes += modulePart
                symbols = modulePart.ParseDeclares(symbols, vbcode.ParseEnums)
            Next
        Next

        ' 然后再进行具体的函数解析就不出错了
        For Each [module] As ModuleBlockSyntax In vbcodes
            part = ModuleParser.CreateModuleInternal([module], symbols)
            project = project.Join(part)
        Next

        Return project
    End Function

    <MethodImpl(MethodImplOptions.AggressiveInlining)>
    Public Function CreateModule(vbcode As [Variant](Of FileInfo, String)) As ModuleSymbol
        Return ModuleParser.CreateModule(vbcode)
    End Function

    <Extension>
    Friend Function SolveStream(vbcode As [Variant](Of FileInfo, String)) As String
        If vbcode Like GetType(String) Then
            Return CType(vbcode, String).SolveStream
        Else
            Return CType(vbcode, FileInfo).FullName.SolveStream
        End If
    End Function

    <Extension>
    Friend Function isExportObject(method As MethodStatementSyntax) As Boolean
        If method.Modifiers.Count = 0 Then
            ' by default is public in VB.NET
            Return True
        Else
            For i As Integer = 0 To method.Modifiers.Count - 1
                If method.Modifiers _
                    .Item(i) _
                    .ValueText _
                    .TextEquals("Public") Then

                    Return True
                End If
            Next

            Return False
        End If
    End Function

    <MethodImpl(MethodImplOptions.AggressiveInlining)>
    <Extension>
    Friend Function param(a As NamedValue(Of String)) As String
        Return $"(param ${a.Name} {typefit(a.Value)})"
    End Function

    <Extension>
    Friend Function objectName(name As IdentifierNameSyntax) As String
        Return name.Identifier.ValueText.Trim("["c, "]"c)
    End Function

    <Extension>
    Friend Function objectName(name As SimpleNameSyntax) As String
        Return name.Identifier.ValueText.Trim("["c, "]"c)
    End Function

    <Extension>
    Friend Function objectName(name As SyntaxToken) As String
        Return name.ValueText.Trim("["c, "]"c)
    End Function
End Module
