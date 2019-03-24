Imports Microsoft.CodeAnalysis
Imports Microsoft.CodeAnalysis.VisualBasic
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Microsoft.VisualBasic.Scripting.SymbolBuilder.VBLanguage

Module treeTest

    Sub Main()
        Dim code = "Module MNain

Public Function Main(x As Integer, Optional y& = 99) As Long

Dim z  =(1+1 + x) 
Dim a& = 88888

x = z * y ^2

return x / 99 + a
End Sub

End Module"
        Dim tree As SyntaxTree = VisualBasicSyntaxTree.ParseText(code)
        Dim root As CompilationUnitSyntax = tree.GetRoot
        Dim main As ModuleBlockSyntax = root.Members(Scan0)

        For Each api_method In main.Members.OfType(Of MethodBlockSyntax)
            Dim func = api_method.Parse

            Call Console.WriteLine(func.ToSExpression)

            Pause()
        Next

        Pause()
    End Sub

End Module
