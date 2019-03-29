Imports Wasm
Imports Wasm.Symbols

Module treeTest

    Sub Main()

        Call test2()

        Dim code = "Module Main

Public Function Main(x As Integer, Optional y& = 99) As Long

Dim z% = (1+1) / x 
Dim a& = 88888

x = z * y * 2

return x / 99 + a
End Function

Public Function Test1(a As Double) As Double

return a + Main(a, -1)

End Function

End Module"

        Dim moduleMain As ModuleSymbol = Wasm.CreateModule(code)

        Console.WriteLine(moduleMain.ToSExpression)

        ' compile vbcode to webassembly
        Dim log = moduleMain.Compile("X:\test.wasm")

        Dim hex = moduleMain.HexDump(verbose:=True)

        Call hex.SaveTo("X:\test.dmp")

        Pause()
    End Sub

    Sub test2()
        Dim moduletest = Wasm.CreateModule("D:\GCModeller-Cloud\php\modules\Linq\TsBuild\Demo\PoissonPDF\Math.vb")

        Console.WriteLine(moduletest.ToSExpression)

        moduletest.Compile("X:\test.wasm")

        Pause()
    End Sub

End Module
