Imports Microsoft.CodeAnalysis
Imports Microsoft.CodeAnalysis.VisualBasic
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax

Module treeTest

    Sub Main()
        Dim code = "Module MNain

Public Sub Main
Console.WriteLine(1+1)
End Sub

End Module"
        Dim tree As SyntaxTree = VisualBasicSyntaxTree.ParseText(code)

        Dim root As CompilationUnitSyntax = tree.GetRoot


        Pause()
    End Sub

End Module
