#Region "Microsoft.VisualBasic::70222df50f64382b7abf519e70db8a51, test\nullreferenceTest.vb"

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

    ' Module nullreferenceTest
    ' 
    '     Function: test
    ' 
    '     Sub: noReturns
    ' 
    ' /********************************************************************************/

#End Region

Module nullreferenceTest

    Declare Function DOMbyId Lib "document" Alias "getElementById" (id As String) As Integer
    Declare Function setAttr Lib "document" Alias "setAttribute" (node As Integer, name As String, value As String) As Integer

    Declare Function print Lib "console" Alias "log" (message As String) As Integer

    Public Sub noReturns()
        print("Nothing")
        print(Nothing)
    End Sub

    Public Function test() As Integer
        Dim node = DOMbyId("test")

        Call setAttr(node, "a", "b")
        ' Nothing means i32 pointer value is zero
        Call setAttr(Nothing, "a", "b")

        Return 0
    End Function

End Module
