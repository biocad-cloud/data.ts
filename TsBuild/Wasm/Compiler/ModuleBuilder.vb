Imports Wasm.Symbols
Imports System.IO
Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ApplicationServices.Development
Imports Microsoft.VisualBasic.Linq
Imports Microsoft.VisualBasic.Text
Imports Wasm.Symbols.Parser

Module ModuleBuilder

    Public Function ToSExpression(m As ModuleSymbol) As String
        Dim import$ = ""
        Dim globals$ = ""
        Dim internal$ = m _
            .InternalFunctions _
            .JoinBy(ASCII.LF & ASCII.LF) _
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
        Dim memoryDev$ = App.NextTempName

        Return $"(module ;; Module {m.LabelName}

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

    {m.Exports.JoinBy(ASCII.LF & "    ")} 

{internal}

)"
    End Function
End Module
