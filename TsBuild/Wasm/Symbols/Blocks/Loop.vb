#Region "Microsoft.VisualBasic::646afd3fd85ed0aab42b232d2264917a, Symbols\Blocks\Loop.vb"

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

    '     Class AbstractBlock
    ' 
    '         Properties: Guid
    ' 
    '         Function: GetDeclareLocals
    ' 
    '     Class Block
    ' 
    '         Properties: Internal
    ' 
    '         Function: InternalBlock
    ' 
    '     Class [Loop]
    ' 
    '         Properties: LoopID
    ' 
    '         Function: ToSExpression, TypeInfer
    ' 
    '     Class br
    ' 
    '         Properties: BlockLabel
    ' 
    '         Function: ToSExpression, TypeInfer
    ' 
    '     Class br_if
    ' 
    '         Properties: Condition
    ' 
    '         Function: ToSExpression, TypeInfer
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.Linq
Imports Microsoft.VisualBasic.Text

Namespace Symbols.Blocks

    Public MustInherit Class AbstractBlock : Inherits Expression

        ''' <summary>
        ''' The label of this block
        ''' </summary>
        ''' <returns></returns>
        Public Property Guid As String

        ''' <summary>
        ''' By default no declares, returns an empty array 
        ''' </summary>
        ''' <returns></returns>
        Friend Overridable Iterator Function GetDeclareLocals() As IEnumerable(Of DeclareLocal)
            ' empty
        End Function
    End Class

    Public MustInherit Class Block : Inherits AbstractBlock

        Public Property Internal As Expression()

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Shared Function InternalBlock(block As IEnumerable(Of Expression), indent As String) As String
            Return block _
                .SafeQuery _
                .Select(Function(line)
                            Return indent & line.ToSExpression
                        End Function) _
                .JoinBy(ASCII.LF)
        End Function
    End Class

    Public Class [Loop] : Inherits Block

        Public Property LoopID As String

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "void"
        End Function

        Public Overrides Function ToSExpression() As String
            Return $"
(block ${Guid} 
    (loop ${LoopID}

        {InternalBlock(Internal, "        ")}

    )
)"
        End Function
    End Class

    Public Class br : Inherits Expression

        Public Property BlockLabel As String

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "void"
        End Function

        Public Overrides Function ToSExpression() As String
            Return $"(br ${BlockLabel})"
        End Function
    End Class

    Public Class br_if : Inherits br

        ''' <summary>
        ''' Is a logical expression
        ''' </summary>
        ''' <returns></returns>
        Public Property Condition As BooleanSymbol

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "void"
        End Function

        Public Overrides Function ToSExpression() As String
            Return $"(br_if ${BlockLabel} {Condition})"
        End Function
    End Class

    ''' <summary>
    ''' 
    ''' </summary>
    Public Class drop : Inherits Expression

        Public Property expression As Expression

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "void"
        End Function

        Public Overrides Function ToSExpression() As String
            Return $"(drop {expression.ToSExpression})"
        End Function
    End Class
End Namespace
