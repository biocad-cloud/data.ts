Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis
Imports Microsoft.CodeAnalysis.VisualBasic
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Microsoft.VisualBasic.Scripting.SymbolBuilder.VBLanguage

' how it works
' 
' vb source => codeDOM => wast model => wast => wasm

Public Class Types

    Public Shared ReadOnly Property Convert2Wasm As New Dictionary(Of Type, String) From {
        {GetType(Integer), "i32"},
        {GetType(Long), "i64"},
        {GetType(Single), "f32"},
        {GetType(Double), "f64"}
    }

    Public Shared ReadOnly Property Operators As New Dictionary(Of String, String) From {
        {"+", "add"},
        {"-", "sub"},
        {"*", "mul"},
        {"/", "div"},
        {"^", "pow"}
    }

    <MethodImpl(MethodImplOptions.AggressiveInlining)>
    Public Shared Function TypeCharWasm(c As Char) As String
        Return Convert2Wasm(Scripting.GetType(Patterns.TypeCharName(c)))
    End Function

End Class

Public Module Extensions

    Public Function CreateModule(vbcode As String) As ModuleSymbol
        Dim tree As SyntaxTree = VisualBasicSyntaxTree.ParseText(vbcode)
        Dim root As CompilationUnitSyntax = tree.GetRoot
        Dim main As ModuleBlockSyntax = root.Members(Scan0)
        Dim functions As New List(Of Func)

        For Each method In main.Members.OfType(Of MethodBlockSyntax)
            functions += method.Parse
        Next

        Return New ModuleSymbol With {
            .InternalFunctions = functions,
            .LabelName = main.ModuleStatement.Identifier.Text
        }
    End Function

    <MethodImpl(MethodImplOptions.AggressiveInlining)>
    <Extension>
    Friend Function param(a As NamedValue(Of String)) As String
        Return $"(param {a.Name} {a.Value})"
    End Function
End Module