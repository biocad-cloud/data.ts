Imports System.ComponentModel
Imports Microsoft.VisualBasic.ApplicationServices.Development.VisualStudio
Imports Microsoft.VisualBasic.CommandLine
Imports Microsoft.VisualBasic.CommandLine.Reflection
Imports Microsoft.VisualBasic.Linq
Imports Microsoft.VisualBasic.Serialization.JSON

Module Program

    Public Function Main() As Integer
        Return GetType(Program).RunCLI(App.CommandLine)
    End Function

    <ExportAPI("/compile")>
    <Description("https://www.typescriptlang.org/docs/handbook/tsconfig-json.html")>
    <Usage("/compile /proj <*.njsproj> [/out <output.js>]")>
    Public Function Compile(args As CommandLine) As Integer
        Dim in$ = args <= "/proj"
        Dim out$ = args("/out") Or ""

        ' njsproj -> code files -> tsconfig.json => files -> tsc
        Dim njsproj As Project = [in].LoadXml(Of Project)
        Dim codes$() = njsproj.ItemGroups _
                              .Select(Function(item)
                                          Return item.TypeScriptCompiles.SafeQuery
                                      End Function) _
                              .IteratesALL _
                              .Where(Function(tsc)
                                         Return tsc.SubType = "Code"
                                     End Function) _
                              .Select(Function(tsc) tsc.Include) _
                              .ToArray
        ' 接下来将会覆盖掉tsconfig之中的files数组
        Dim config$ = $"{[in].ParentPath}/tsconfig.json"
        Dim tsconfig As tsconfig = config.LoadJSON(Of tsconfig)

        tsconfig.files = codes
        tsconfig.savejson(config)
    End Function
End Module
