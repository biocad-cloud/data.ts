Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language
Imports Microsoft.VisualBasic.Text
Imports Wasm.Symbols.Blocks

Namespace Symbols

    ''' <summary>
    ''' The abstract of the function object, only have function name, parameter and result type definition.
    ''' </summary>
    Public Class FuncSignature : Inherits Expression

        Public Property Name As String
        Public Property Parameters As NamedValue(Of String)()
        Public Property Result As String

        Friend Sub New()
        End Sub

        Friend Sub New(var As NamedValue(Of String))
            Name = var.Name
            Result = var.Value
        End Sub

        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return Result
        End Function

        Public Overrides Function ToSExpression() As String
            Throw New NotImplementedException()
        End Function
    End Class

    ''' <summary>
    ''' Contains function body declare
    ''' </summary>
    Public Class FuncSymbol : Inherits FuncSignature

        Public Property Body As Expression()
        Public Property Locals As DeclareLocal()

        Public ReadOnly Property VBDeclare As String
            Get
                With Parameters _
                    .Select(Function(a) $"{a.Name} As {a.Value}") _
                    .JoinBy(", ")

                    Return $"Public Function {Name}({ .ByRef}) As {Result}"
                End With
            End Get
        End Property

        Sub New()
        End Sub

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Friend Sub New(funcVar As NamedValue(Of String))
            Call MyBase.New(funcVar)
        End Sub

        ''' <summary>
        ''' 因为webassembly只允许变量必须要定义在最开始的位置
        ''' 所以构建函数体的时候流程会有些复杂
        ''' </summary>
        ''' <returns></returns>
        Private Function buildBody() As String
            ' 先声明变量，然后再逐步赋值
            Dim declareLocals As New List(Of String)
            Dim body As New List(Of String)

            For Each line In Me.Body
                If TypeOf line Is DeclareLocal Then
                    declareLocals += line.ToSExpression

                    With DirectCast(line, DeclareLocal)
                        If Not .init Is Nothing Then
                            body += .SetLocal.ToSExpression
                        End If
                    End With
                ElseIf TypeOf line Is AbstractBlock Then
                    For Each local In DirectCast(line, AbstractBlock).GetDeclareLocals
                        ' set local 在block的内部执行
                        ' 在这里只需要提取出申明部分即可
                        declareLocals += line.ToSExpression
                    Next

                    body += line.ToSExpression
                Else
                    body += line.ToSExpression
                End If
            Next

            Return declareLocals.JoinBy(ASCII.LF) & body.JoinBy(ASCII.LF)
        End Function

        Public Overrides Function ToSExpression() As String
            Dim params$ = Parameters.Select(Function(a) a.param).JoinBy(" ")

            Return $"(func ${Name} {params} (result {Result})
    ;; {VBDeclare}
    {buildBody()}
)"
        End Function
    End Class
End Namespace