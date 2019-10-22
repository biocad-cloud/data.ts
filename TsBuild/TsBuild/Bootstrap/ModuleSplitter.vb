Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Microsoft.VisualBasic.Text

Namespace Bootstrap

    Module ModuleSplitter

        ''' <summary>
        ''' 将bootstrap应用模块解析出来
        ''' </summary>
        ''' <param name="tokens"></param>
        ''' <param name="sourceJs$"></param>
        ''' <returns></returns>
        <Extension>
        Public Iterator Function PopulateModules(tokens As IEnumerable(Of Token), sourceJs$) As IEnumerable(Of NamedValue(Of String))
            ' app模块在编译出来的js文件中是从最顶层的declare起始的
            Dim modTokens As New List(Of Token)
            Dim stack As New Stack(Of Integer)

            sourceJs = sourceJs.LineTokens.JoinBy(ASCII.LF)

            For Each t As Token In tokens
                If t = TypeScriptTokens.declare AndAlso stack.Count = 0 AndAlso modTokens > 0 Then
                    ' 这个可能是最顶层的模块申明
                    If modTokens.isModuleDefinition Then
                        Yield modTokens.createModuleInternal(sourceJs)
                    Else
                        modTokens *= 0
                    End If
                ElseIf t = TypeScriptTokens.openStack Then
                    stack.Push(t.start)
                ElseIf t = TypeScriptTokens.closeStack Then
                    stack.Pop()
                End If

                modTokens += t
            Next

            If modTokens > 0 AndAlso modTokens.isModuleDefinition Then
                Yield modTokens.createModuleInternal(sourceJs)
            End If
        End Function

        <Extension>
        Private Function createModuleInternal(modTokens As List(Of Token), sourceJs$) As NamedValue(Of String)
            Dim start = modTokens.First.start
            Dim len = modTokens.Last.ends - modTokens.First.start
            Dim jsBlock = sourceJs.Substring(start, len)
            Dim appName = modTokens.getAppName
            Dim ref = modTokens.getModuleReference

            Return New NamedValue(Of String) With {
                .Description = appName,
                .Name = ref,
                .Value = jsBlock
            }
        End Function

        <Extension>
        Private Function getAppName(modTokens As List(Of Token)) As String

        End Function

        <Extension>
        Private Function getModuleReference(modTokens As List(Of Token)) As String

        End Function

        <Extension>
        Private Function isModuleDefinition(modTokens As List(Of Token)) As Boolean
            ' 是否具有class注释标记
            If Not modTokens.hasClassAnnotation Then
                Return False
            End If
            If Not modTokens.hasAppNameProperty Then
                Return False
            End If
            If Not modTokens.hasInitFunction Then
                Return False
            End If
            If Not modTokens.hasReferBootstrap Then
                Return False
            End If

            Return True
        End Function

        <Extension>
        Private Function hasReferBootstrap(modTokens As List(Of Token)) As Boolean
            For Each t As Token In modTokens
                If t = TypeScriptTokens.identifier AndAlso t = "Bootstrap" Then
                    Return True
                End If
            Next

            Return False
        End Function

        <Extension>
        Private Function hasInitFunction(modTokens As List(Of Token)) As Boolean
            For Each t As Token In modTokens
                If t = TypeScriptTokens.identifier AndAlso t.text.EndsWith(".prototype.init") Then
                    Return True
                End If
            Next

            Return False
        End Function

        <Extension>
        Private Function hasAppNameProperty(modTokens As List(Of Token)) As Boolean
            For Each t As Token In modTokens
                If t = TypeScriptTokens.string AndAlso t = """appName""" Then
                    Return True
                End If
            Next

            Return False
        End Function

        <Extension>
        Private Function hasClassAnnotation(modTokens As List(Of Token)) As Boolean
            For Each t As Token In modTokens
                If t = TypeScriptTokens.comment AndAlso t = "/** @class */" Then
                    Return True
                End If
            Next

            Return False
        End Function
    End Module
End Namespace