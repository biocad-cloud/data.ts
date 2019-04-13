Imports System.IO
Imports Microsoft.VisualBasic.ApplicationServices.Development
Imports Microsoft.VisualBasic.Linq
Imports Microsoft.VisualBasic.Text
Imports Wasm.Symbols
Imports Wasm.Symbols.Blocks
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

    {m.Exports.JoinBy(ASCII.LF & "    ")} 

{internal})"
    End Function
End Module
