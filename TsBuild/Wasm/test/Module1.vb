Module treeTest

    Sub Main()
        Dim code = "Module Main

Public Function Main(x As Integer, Optional y& = 99) As Long

Dim z  =(1+1 + x) 
Dim a& = 88888

x = z * y ^2

return x / 99 + a
End Sub

End Module"

        Dim moduleMain = Wasm.CreateModule(code)

        Pause()
    End Sub

End Module
