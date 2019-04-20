#Region "Microsoft.VisualBasic::88bd1144f3c74929a12884f346b4565b, Compiler\ModuleBuilder.vb"

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

    ' Module ModuleBuilder
    ' 
    '     Function: exportGroup, funcGroup, ToSExpression
    ' 
    ' /********************************************************************************/

#End Region

Imports System.IO
Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ApplicationServices.Development
Imports Microsoft.VisualBasic.Linq
Imports Microsoft.VisualBasic.Text
Imports Wasm.Symbols
Imports Wasm.Symbols.Parser

Module ModuleBuilder

    Public Function ToSExpression(m As ModuleSymbol) As String
        Dim import$ = ""
        Dim globals$ = ""
        Dim internal$ = m _
            .InternalFunctions _
            .funcGroup _
            .JoinBy(vbCrLf) _
            .LineTokens _
            .Select(Function(line) "    " & line) _
            .JoinBy(ASCII.LF)

        If Not m.[Imports].IsNullOrEmpty Then
            import = m.[Imports] _
                .SafeQuery _
                .Select(Function(i) i.ToSExpression) _
                .JoinBy(ASCII.LF & "    ")
        End If
        If Not m.Globals.IsNullOrEmpty Then
            globals = m.Globals _
                .Select(Function(g) g.ToSExpression) _
                .JoinBy(ASCII.LF & ASCII.LF)
        End If

        Dim wasmSummary As AssemblyInfo = GetType(ModuleSymbol).GetAssemblyDetails
        Dim buildTime$ = File.GetLastWriteTime(GetType(ModuleSymbol).Assembly.Location)
        Dim stringsData$ = m.Memory _
            .Where(Function(oftype) TypeOf oftype Is StringSymbol) _
            .Select(Function(s) s.ToSExpression) _
            .JoinBy(ASCII.LF)

        Return $"(module ;; Module {m.LabelName}

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: {wasmSummary.AssemblyVersion}
    ;; build: {buildTime}

    ;; imports must occur before all non-import definitions

    {import}
    
    ;; Only allows one memory block in each module
    (memory (import ""env"" ""bytechunks"") 1)

    ;; Memory data for string constant
    {stringsData}
    
    {globals}

    {m.Exports.exportGroup.JoinBy(ASCII.LF & "    ")} 

{internal})"
    End Function

    <Extension>
    Private Iterator Function exportGroup(exports As ExportSymbolExpression()) As IEnumerable(Of String)
        Dim moduleGroup = exports.GroupBy(Function(api) api.Module).ToArray

        For Each [module] In moduleGroup
            Yield $";; export from [{[module].Key}]"
            Yield ""

            For Each func As ExportSymbolExpression In [module]
                Yield func.ToSExpression
            Next

            Yield ""
            Yield ""
        Next
    End Function

    <Extension>
    Private Iterator Function funcGroup(internal As FuncSymbol()) As IEnumerable(Of String)
        Dim moduleGroups = internal.GroupBy(Function(f) f.Module).ToArray

        For Each [module] In moduleGroups
            Yield $";; functions in [{[module].Key}]"
            Yield ""

            For Each func As FuncSymbol In [module]
                Yield func.ToSExpression
            Next

            Yield ""
            Yield ""
        Next
    End Function
End Module
