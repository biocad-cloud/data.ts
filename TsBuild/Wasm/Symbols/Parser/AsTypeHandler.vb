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
        ''' <param name="name$"></param>
        ''' <param name="asClause"></param>
        ''' <returns></returns>
        <Extension>
        Public Function AsType(ByRef name$, [asClause] As AsClauseSyntax) As String
            Dim type$

            If Not asClause Is Nothing Then
                type = Types.Convert2Wasm(GetAsType(asClause))
            ElseIf name.Last Like Patterns.TypeChar Then
                type = Types.TypeCharWasm(name.Last)
                name = name.Substring(0, name.Length - 1)
            Else
                ' Throw New Exception("Object type is not supported in WebAssembly!")
                type = Types.Convert2Wasm(GetType(Double))
            End If

            Return type
        End Function


        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Function GetAsType([as] As SimpleAsClauseSyntax) As Type
            Dim type = DirectCast([as].Type, PredefinedTypeSyntax)
            Dim token$ = type.Keyword.ValueText

            Return Scripting.GetType(token)
        End Function
    End Module
End Namespace