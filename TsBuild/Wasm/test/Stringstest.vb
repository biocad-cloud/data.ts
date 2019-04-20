#Region "Microsoft.VisualBasic::5169b5808b2b20c22e643fb674ba38da, test\Stringstest.vb"

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

    ' Module Stringstest
    ' 
    '     Function: Hello, Main, World
    ' 
    ' /********************************************************************************/

#End Region

Module Stringstest

    ' imports console.log api from javascript
    Public Declare Function Print Lib "console" Alias "log" (text As String) As Integer

    Dim a = 99
    Dim b = 100

    Public Function Main() As String
        Dim str As String = Hello() & " " & World()
        Dim C# = 8888888888888
        Dim format$ = $"let {a} + {b} / {C} = {a + b / C}"

        Call Print(str)
        Call Print(format)

        Return str
    End Function

    Public Function Hello() As String
        Return "Hello"
    End Function

    Public Function World() As String
        Return "World"
    End Function
End Module
