#Region "Microsoft.VisualBasic::e560017e0f6e60295e765414531bfba1, test\EnumTest.vb"

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

    ' Enum defaultIsInteger
    ' 
    '     Y, Z
    ' 
    '  
    ' 
    ' 
    ' 
    ' Enum asInteger
    ' 
    '     B, C, D, E, F
    '     G
    ' 
    '  
    ' 
    ' 
    ' 
    ' Enum asLong
    ' 
    '     B, C, D, E, F
    '     G
    ' 
    '  
    ' 
    ' 
    ' 
    ' Module EnumTest
    ' 
    '     Function: Add1, DoAdd
    ' 
    ' /********************************************************************************/

#End Region

Public Enum defaultIsInteger
    X = 999
    Z
    Y
End Enum

Public Enum asInteger As Integer
    A = 1
    B
    C
    D
    E
    F
    G
End Enum

Public Enum asLong As Long
    A = 1
    B
    C
    E
    D
    F
    G
End Enum

Module EnumTest

    Public Function DoAdd() As Integer
        Return Add1(asInteger.C + asLong.E + defaultIsInteger.X)
    End Function

    Public Function Add1(i As asInteger) As asLong
        Dim x = i + 1
        Dim a = CType(x, asLong)

        Return a
    End Function
End Module
