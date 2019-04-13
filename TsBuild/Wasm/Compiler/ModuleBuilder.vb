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
        Dim memoryDev$ = "X" & CInt(200 + VBMath.Rnd() * 512).ToHexString
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
    (memory ${memoryDev} 1)  

    ;; Memory data for string constant
    {stringsData}
    
    {globals}

    ;; Export memory block to Javascript 
    (export ""memory"" (memory ${memoryDev})) 

    {m.Exports.JoinBy(ASCII.LF & "    ")} 

{internal}

    {MemorySizeOf(m.Memory)}

)"
    End Function

    ''' <summary>
    ''' The memory size helper function
    ''' </summary>
    ''' <param name="memory"></param>
    ''' <returns></returns>
    Public Function MemorySizeOf(memory As Memory) As String
        Dim intPtr As New GetLocalVariable With {.var = "intPtr"}
        Dim symbols As New SymbolTable(New DeclareLocal With {.name = intPtr.var, .type = "i32"})
        Dim isAddress = Function(s As StringSymbol) As BooleanSymbol
                            Return New BooleanSymbol With {
                                .Condition = BinaryStack(intPtr, s.AddressOf, "=", symbols)
                            }
                        End Function
        Dim ifs As String() = memory _
            .Select(Function(data)
                        If TypeOf data Is StringSymbol Then
                            Return New IfBlock With {
                                .Guid = App.NextTempName,
                                .Condition = isAddress(data),
                                .[Then] = {
                                    New ReturnValue With {.Internal = DirectCast(data, StringSymbol).SizeOf}
                                }
                            }
                        Else
                            Throw New NotImplementedException
                        End If
                    End Function) _
            .Select(Function(data) data.ToSExpression) _
            .ToArray

        Return $"
(export ""{NameOf(MemorySizeOf)}"" (func ${NameOf(MemorySizeOf)}))

(func ${NameOf(MemorySizeOf)} (param ${intPtr.var} i32) (result i32)
    {ifs.JoinBy("    ")}

    ;; pointer not found
    (return (i32.const -1))
)
"
    End Function
End Module
