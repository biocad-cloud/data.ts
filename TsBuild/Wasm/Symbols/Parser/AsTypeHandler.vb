#Region "Microsoft.VisualBasic::69a0103ed944a40af0e51ae22ff5653c, Symbols\Parser\AsTypeHandler.vb"

    ' Author:
    ' 
    '       xieguigang (I@xieguigang.me)
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

    '     Module AsTypeHandler
    ' 
    '         Function: AsType, GetAsType
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.Scripting.SymbolBuilder.VBLanguage

Namespace Symbols.Parser

    ''' <summary>
    ''' 因为VB的变量可以使用TypeChar和As这两种形式的申明
    ''' 所以在这里对变量类型的申明解析会比较复杂一些
    ''' </summary>
    Module AsTypeHandler

        ''' <summary>
        ''' 这个函数返回WASM之中的基本数据类型
        ''' </summary>
        ''' <param name="name"></param>
        ''' <param name="asClause"></param>
        ''' <returns></returns>
        ''' <remarks>
        ''' 当类型申明是空的时候，应该是从其初始化值得类型来推断申明的
        ''' </remarks>
        <Extension>
        Public Function AsType(ByRef name$, [asClause] As AsClauseSyntax, symbols As SymbolTable, Optional initType$ = "f32") As String
            Dim type$

            If Not asClause Is Nothing Then
                type = Types.Convert2Wasm(GetAsType(asClause, symbols))
            ElseIf name.Last Like Patterns.TypeChar Then
                type = Types.TypeCharWasm(name.Last)
                name = name.Substring(0, name.Length - 1)
            Else
                ' Throw New Exception("Object type is not supported in WebAssembly!")
                type = initType
            End If

            Return type
        End Function


        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Function GetAsType([as] As SimpleAsClauseSyntax, symbols As SymbolTable) As Type
            If TypeOf [as].Type Is PredefinedTypeSyntax Then
                Dim type = DirectCast([as].Type, PredefinedTypeSyntax)
                Dim token$ = type.Keyword.ValueText

                Return Scripting.GetType(token)
            Else
                Dim type = DirectCast([as].Type, IdentifierNameSyntax)
                Dim token$ = type.Identifier.Text
                Dim [const] As EnumSymbol = symbols.GetEnumType(token)

                Return [const].UnderlyingType
            End If
        End Function
    End Module
End Namespace
