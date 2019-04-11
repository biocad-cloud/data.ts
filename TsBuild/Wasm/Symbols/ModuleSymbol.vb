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

            Return $"(module ;; Module {LabelName}

    ;; Auto-Generated VisualBasic.NET WebAssembly Code
    ;;
    ;; WASM for VisualBasic.NET
    ;; 
    ;; version: {wasmSummary.AssemblyVersion}
    ;; build: {buildTime}

    {import}
    
    {globals}

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