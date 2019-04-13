#Region "Microsoft.VisualBasic::b3a2874be3e8b9ba53e9dc8e045e2799, Symbols\ModuleSymbol.vb"

    ' Author:
    ' 
    '       xieguigang (I@xieguigang.me)
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

    '     Class ModuleSymbol
    ' 
    '         Properties: [Imports], Exports, Globals, InternalFunctions, LabelName
    ' 
    '         Function: CreateModule, GenericEnumerator, GetEnumerator, ToSExpression, TypeInfer
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports System.IO
Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ApplicationServices.Development
Imports Microsoft.VisualBasic.Linq
Imports Microsoft.VisualBasic.Text
Imports Wasm.Symbols.Parser

Namespace Symbols

    Public Class ModuleSymbol : Inherits Expression
        Implements Enumeration(Of Expression)

        Public Property InternalFunctions As FuncSymbol()
        Public Property Exports As ExportSymbolExpression()
        Public Property [Imports] As ImportSymbol()
        Public Property Globals As DeclareGlobal()

        ''' <summary>
        ''' The module name label
        ''' </summary>
        ''' <returns></returns>
        Public Property LabelName As String

        Public Iterator Function GenericEnumerator() As IEnumerator(Of Expression) Implements Enumeration(Of Expression).GenericEnumerator
            For Each func As FuncSymbol In InternalFunctions
                Yield func
            Next
        End Function

        Public Iterator Function GetEnumerator() As IEnumerator Implements Enumeration(Of Expression).GetEnumerator
            Yield GenericEnumerator()
        End Function

        Public Overrides Function ToSExpression() As String
            Dim import$ = ""
            Dim globals$ = ""
            Dim internal$ = InternalFunctions _
                .JoinBy(ASCII.LF & ASCII.LF) _
                .LineTokens _
                .Select(Function(line) "    " & line) _
                .JoinBy(ASCII.LF)

            If Not [Imports].IsNullOrEmpty Then
                import = [Imports] _
                    .SafeQuery _
                    .Select(Function(i) i.ToSExpression) _
                    .JoinBy(ASCII.LF & "    ")
            End If
            If Not Me.Globals.IsNullOrEmpty Then
                globals = Me.Globals _
                    .Select(Function(g) g.ToSExpression) _
                    .JoinBy(ASCII.LF & ASCII.LF)
            End If

            Dim wasmSummary As AssemblyInfo = GetType(ModuleSymbol).GetAssemblyDetails
            Dim buildTime$ = File.GetLastWriteTime(GetType(ModuleSymbol).Assembly.Location)
            Dim memoryDev$ = App.NextTempName

            Return $"(module ;; Module {LabelName}

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: {wasmSummary.AssemblyVersion}
    ;; build: {buildTime}

    ;; Only allows one memory block in each module
    (memory ${memoryDev} 1)  

    {import}
    
    {globals}

    ;; Export memory block to Javascript 
    (export ""memory"" (memory ${memoryDev})) 

    {Exports.JoinBy(ASCII.LF & "    ")} 

{internal}

)"
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "any"
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Shared Function CreateModule(vbcode As String) As ModuleSymbol
            Return ModuleParser.CreateModule(vbcode)
        End Function
    End Class
End Namespace
