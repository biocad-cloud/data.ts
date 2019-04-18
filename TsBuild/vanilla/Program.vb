Imports System.ComponentModel
Imports Microsoft.VisualBasic.ApplicationServices.Development.VisualStudio
Imports Microsoft.VisualBasic.CommandLine
Imports Microsoft.VisualBasic.CommandLine.Reflection
Imports Wasm.Symbols

''' <summary>
''' 在进行编译的时候会遵循下面的搜索规则：
''' 
''' 1. 会首先在当前的文件夹内搜索vbproj文件，不会搜索子文件夹
''' 2. 如果搜索成功，则会将vbproj文件进行编译
''' 3. 如果搜索不成功，则会将当前文件夹内的所有vb源代码文件进行编译，包括子文件夹
''' 
''' 如果在命令行之中明确的提供了文件路径，则只会对所传递进来的文件进行编译
''' </summary>
Module Program

    Public Function Main() As Integer
        Return GetType(Program).RunCLI(App.CommandLine, AddressOf CompileTargetFileRoutine, AddressOf AutoSearchRoutine)
    End Function

    ''' <summary>
    ''' ``vbw &lt;file> [...args]``
    ''' </summary>
    ''' <param name="file"></param>
    ''' <param name="args"></param>
    ''' <returns></returns>
    Private Function CompileTargetFileRoutine(file As String, args As CommandLine) As Integer
        Dim moduleSymbol As ModuleSymbol
        Dim out$ = args("/out") Or file.ChangeSuffix("wasm")

        If file.ExtensionSuffix.TextEquals("vb") Then
            moduleSymbol = Wasm.CreateModule(file)
        Else
            moduleSymbol = Wasm.CreateModuleFromProject(vbproj:=file)
        End If

        Return Wasm.Compile(moduleSymbol, out) _
            .SaveTo(out.ChangeSuffix("log")) _
            .CLICode
    End Function

    Private Function AutoSearchRoutine() As Integer
        Dim vbprojs = App.CurrentDirectory _
            .EnumerateFiles("*.vbproj") _
            .Select(AddressOf LoadXml(Of Project)) _
            .ToArray

        If vbprojs.IsNullOrEmpty Then
            Throw New NotImplementedException
        Else
            For Each proj As Project In vbprojs

            Next
        End If
    End Function

    <ExportAPI("/wast")>
    <Usage("/wast /target <vbproj/vb> [/out <*.wast>]")>
    <Description("Dumping VB.NET source file as WebAssembly S-Expression code.")>
    Public Function DumpWast(args As CommandLine) As Integer

    End Function
End Module
