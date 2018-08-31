Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.Serialization.JSON

''' <summary>
''' The presence of a tsconfig.json file in a directory indicates that the directory is the 
''' root of a TypeScript project. The tsconfig.json file specifies the root files and the 
''' compiler options required to compile the project. A project is compiled in one of the 
''' following ways:
'''
''' #### Using tsconfig.json
''' 
''' 1. By invoking tsc With no input files, In which Case the compiler searches For the 
'''    tsconfig.json file starting In the current directory And continuing up the parent 
'''    directory chain.
''' 2. By invoking tsc With no input files And a --project (Or just -p) command line Option 
'''    that specifies the path Of a directory containing a tsconfig.json file, Or a path To 
'''    a valid .json file containing the configurations.
'''    
''' When input files are specified on the command line, tsconfig.json files are ignored.
''' </summary>
Public Class tsconfig

    Public Property compilerOptions As Dictionary(Of String, String)
    Public Property files As String()

    <MethodImpl(MethodImplOptions.AggressiveInlining)>
    Public Overrides Function ToString() As String
        Return Me.GetJson
    End Function
End Class
