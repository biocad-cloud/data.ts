Imports System.ComponentModel
Imports Microsoft.VisualBasic.ApplicationServices.Development.VisualStudio
Imports Microsoft.VisualBasic.CommandLine
Imports Microsoft.VisualBasic.CommandLine.Reflection
Imports Wasm
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
    ''' ``vanilla &lt;file> [...args]``
    ''' </summary>
    ''' <param name="file"></param>
    ''' <param name="args"></param>
    ''' <returns></returns>
    Private Function CompileTargetFileRoutine(file As String, args As CommandLine) As Integer
        Dim moduleSymbol As ModuleSymbol
        Dim out$
        Dim debug As Boolean = args("/debug")

        If file.ExtensionSuffix.TextEquals("vb") Then
            moduleSymbol = Wasm.CreateModule(file)
            out = args("/out") Or file.ChangeSuffix("wasm")
        Else
            Dim profile$ = args("/profile") Or "Release|AnyCPU"
            Dim vbproj As Project = file.LoadXml(Of Project)

            moduleSymbol = Wasm.CreateModuleFromProject(vbproj:=file)
            out = args("/out") Or $"{vbproj.GetOutputDirectory(profile)}/{vbproj.GetOutputName}.wasm"

            If profile.Split("|"c).First = "Debug" Then
                debug = True
            End If
        End If

        Call moduleSymbol.ToSExpression.SaveTo(out.ChangeSuffix("wast"))
        Call moduleSymbol.HexDump(verbose:=True).SaveTo(out.ChangeSuffix("dmp"))

        Dim config As New wat2wasm With {.output = out}

        If debug Then
            config.debugNames = True
            config.debugParser = True
            config.verbose = True
        End If

        Return Wasm.Compile(moduleSymbol, config) _
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
End Module
