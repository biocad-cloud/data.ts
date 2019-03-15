Imports Microsoft.VisualBasic.Emit.CodeDOM_VBC

Module Module1

    Sub Main()
        Call test()
    End Sub

    Sub test()

        Dim src = "
Module Test1

Public Function add(x As Integer, y As Integer) As Double
    Return x + y
End Function

End Module
"
        Dim dll = VBC.CompileCode(src, VBC.CreateParameters({}))

        Pause()
    End Sub
End Module
