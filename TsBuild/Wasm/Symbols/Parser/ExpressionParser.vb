#Region "Microsoft.VisualBasic::77c37c2c17597063a0b13bea37f58ff8, Symbols\Parser\ExpressionParser.vb"

    ' Author:
    ' 
    '       xieguigang (I@xieguigang.me)
    '       asuka (evia@lilithaf.me)
    ' 
    ' Copyright (c) 2019 GCModeller Cloud Platform
    ' 
    ' 
    ' MIT License
    ' 
    ' 
    ' Permission is hereby granted, free of charge, to any person obtaining a copy
    ' of this software and associated documentation files (the "Software"), to deal
    ' in the Software without restriction, including without limitation the rights
    ' to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    ' copies of the Software, and to permit persons to whom the Software is
    ' furnished to do so, subject to the following conditions:
    ' 
    ' The above copyright notice and this permission notice shall be included in all
    ' copies or substantial portions of the Software.
    ' 
    ' THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    ' IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    ' FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    ' AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    ' LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    ' OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    ' SOFTWARE.



    ' /********************************************************************************/

    ' Summaries:

    '     Module ExpressionParse
    ' 
    '         Function: Argument, ArgumentSequence, (+2 Overloads) BinaryStack, ConstantExpression, CreateArray
    '                   CreateObject, fillParameters, FunctionInvoke, InvokeFunction, MemberExpression
    '                   ObjectInvoke, ParenthesizedStack, ReferVariable, StringConstant, UnaryExpression
    '                   UnaryValue, ValueCType, ValueExpression
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.CodeAnalysis
Imports Microsoft.CodeAnalysis.VisualBasic.Syntax
Imports Microsoft.VisualBasic.ComponentModel.DataSourceModel
Imports Microsoft.VisualBasic.Language

Namespace Symbols.Parser

    Module ExpressionParse

        <Extension>
        Public Function ValueExpression(value As ExpressionSyntax, symbols As SymbolTable) As Expression
            Select Case value.GetType
                Case GetType(BinaryExpressionSyntax)
                    Return DirectCast(value, BinaryExpressionSyntax).BinaryStack(symbols)
                Case GetType(ParenthesizedExpressionSyntax)
                    Return DirectCast(value, ParenthesizedExpressionSyntax).ParenthesizedStack(symbols)
                Case GetType(LiteralExpressionSyntax)
                    Return DirectCast(value, LiteralExpressionSyntax).ConstantExpression(Nothing, symbols)
                Case GetType(IdentifierNameSyntax)
                    Return DirectCast(value, IdentifierNameSyntax).ReferVariable(symbols)
                Case GetType(InvocationExpressionSyntax)
                    Return DirectCast(value, InvocationExpressionSyntax).FunctionInvoke(symbols)
                Case GetType(UnaryExpressionSyntax)
                    Return DirectCast(value, UnaryExpressionSyntax).UnaryExpression(symbols)
                Case GetType(CTypeExpressionSyntax)
                    Return DirectCast(value, CTypeExpressionSyntax).ValueCType(symbols)
                Case GetType(MemberAccessExpressionSyntax)
                    Return DirectCast(value, MemberAccessExpressionSyntax).MemberExpression(symbols)
                Case GetType(InterpolatedStringExpressionSyntax)
                    Return DirectCast(value, InterpolatedStringExpressionSyntax).StringExpression(symbols)
                Case GetType(CollectionInitializerSyntax)
                    Return DirectCast(value, CollectionInitializerSyntax).CreateArray(symbols)
                Case GetType(ObjectCreationExpressionSyntax)
                    Return DirectCast(value, ObjectCreationExpressionSyntax).CreateObject(symbols)
                Case Else
                    Throw New NotImplementedException(value.GetType.FullName)
            End Select
        End Function

        <Extension>
        Public Function CreateObject(create As ObjectCreationExpressionSyntax, symbols As SymbolTable) As Expression
            Dim type = create.Type
            Dim typeName$

            If TypeOf type Is GenericNameSyntax Then
                Dim elementType As Type

                With DirectCast(type, GenericNameSyntax).GetGenericType(symbols)
                    typeName = .Name
                    elementType = .Value
                End With

                If typeName = "List" Then
                    ' array和list在javascript之中都是一样的
                    typeName = Types.Convert2Wasm(elementType)

                    Return New ArraySymbol With {
                        .Type = typeName,
                        .Initialize = {}
                    }
                Else
                    Throw New NotImplementedException
                End If
            Else
                Throw New NotImplementedException
            End If
        End Function

        <Extension>
        Public Function CreateArray(newArray As CollectionInitializerSyntax, symbols As SymbolTable) As Expression
            Dim elements = newArray.Initializers _
                .Select(Function(value)
                            Return value.ValueExpression(symbols)
                        End Function) _
                .ToArray
            Dim array As New ArraySymbol With {
                .Initialize = elements
            }

            Return array
        End Function

        <Extension>
        Public Function MemberExpression(ref As MemberAccessExpressionSyntax, symbols As SymbolTable) As Expression
            Dim objName = ref.Expression.ToString
            Dim memberName = ref.Name.objectName
            Dim [const] As EnumSymbol

            If symbols.HaveEnumType(objName) Then
                [const] = symbols.GetEnumType(objName)

                Return New LiteralExpression With {
                    .type = [const].type,
                    .value = [const].Members(memberName)
                }
            ElseIf symbols.GetObjectSymbol(objName).IsArray AndAlso memberName = "Length" Then
                ' 可能是获取数组长度
                Return New FuncInvoke With {
                    .Reference = JavaScriptImports.ArrayLength.Name,
                    .Parameters = {
                        New GetLocalVariable With {.var = objName}
                    }
                }
            ElseIf symbols.GetObjectSymbol(objName).type Like Types.stringType Then
                ' 是字符串的一些对象方法
                Dim api As ImportSymbol = JavaScriptImports.GetStringMethod(memberName)

                Call symbols.addRequired(api)

                Return New FuncInvoke With {
                    .Reference = api.Name,
                    .Parameters = {
                        New GetLocalVariable With {.var = objName}
                    }
                }
            Else
                Throw New NotImplementedException(ref.ToString)
            End If
        End Function

        <Extension>
        Public Function ValueCType(cast As CTypeExpressionSyntax, symbols As SymbolTable) As Expression
            Dim value As Expression = cast.Expression.ValueExpression(symbols)
            Dim castToType As String = Types.Convert2Wasm(cast.Type.GetType(symbols))

            Return Types.CType(castToType, value, symbols)
        End Function

        ''' <summary>
        ''' 可能是常量，也可能是一个变量引用
        ''' </summary>
        ''' <param name="unary"></param>
        ''' <param name="symbols"></param>
        ''' <returns></returns>
        <Extension>
        Public Function UnaryExpression(unary As UnaryExpressionSyntax, symbols As SymbolTable) As FuncInvoke
            Dim op$ = unary.OperatorToken.ValueText
            Dim right = unary.Operand.ValueExpression(symbols)
            Dim left = New LiteralExpression With {
                .type = right.TypeInfer(symbols),
                .value = 0
            }

            Return New FuncInvoke With {
                .Parameters = {left, right},
                .Reference = $"{left.type}.{Types.Operators(op)}",
                .[operator] = True
            }
        End Function

        ''' <summary>
        ''' 常量表达式
        ''' </summary>
        ''' <param name="unary"></param>
        ''' <returns></returns>
        <Extension>
        Public Function UnaryValue(unary As UnaryExpressionSyntax) As String
            Dim op$ = unary.OperatorToken.ValueText
            Dim valueToken = DirectCast(unary.Operand, LiteralExpressionSyntax)
            Dim value$ = valueToken.Token.ValueText

            Return op & value
        End Function

        <Extension>
        Public Function Argument(arg As ArgumentSyntax, symbols As SymbolTable, param As NamedValue(Of String)) As Expression
            Dim value As Expression = arg _
                .GetExpression _
                .ValueExpression(symbols)
            Dim left$ = param.Value

            Return Types.CType(left, value, symbols)
        End Function

        <Extension>
        Public Function FunctionInvoke(invoke As InvocationExpressionSyntax, symbols As SymbolTable) As FuncInvoke
            Dim reference = invoke.Expression
            Dim funcName$

            ' 得到被调用的目标函数的名称符号
            Select Case reference.GetType
                Case GetType(SimpleNameSyntax)
                    funcName = DirectCast(reference, SimpleNameSyntax).objectName
                Case GetType(IdentifierNameSyntax)
                    funcName = DirectCast(reference, IdentifierNameSyntax).objectName
                Case GetType(MemberAccessExpressionSyntax)
                    Dim acc = DirectCast(reference, MemberAccessExpressionSyntax)
                    ' 模块或者变量名称
                    Dim target = acc.Expression
                    ' 目标函数名称
                    funcName$ = acc.Name.objectName

                    Return target.ObjectInvoke(funcName, invoke.ArgumentList, symbols)
                Case Else
                    Throw New NotImplementedException(reference.GetType.FullName)
            End Select

            Return symbols.InvokeFunction(funcName, invoke.ArgumentList)
        End Function

        ''' <summary>
        ''' 需要判断一下target的类型
        ''' 如果是本地变量，全局变量，常量，则可能是对象实例方法或者拓展方法
        ''' </summary>
        ''' <param name="target"></param>
        ''' <param name="funcName$"></param>
        ''' <param name="symbols"></param>
        ''' <returns></returns>
        <Extension>
        Public Function ObjectInvoke(target As ExpressionSyntax,
                                     funcName$,
                                     argumentList As ArgumentListSyntax,
                                     symbols As SymbolTable) As Expression

            Dim argumentFirst As Expression = Nothing
            Dim funcDeclare As FuncSignature
            Dim leftArguments As NamedValue(Of String)()

            If TypeOf target Is LiteralExpressionSyntax Then
                funcDeclare = symbols.GetFunctionSymbol(Nothing, funcName)
                argumentFirst = target.ValueExpression(symbols)
                leftArguments = funcDeclare.Parameters.Skip(1).ToArray
            ElseIf TypeOf target Is IdentifierNameSyntax Then
                ' 模块静态引用或者对象实例引用
                Dim name$ = DirectCast(target, IdentifierNameSyntax).objectName

                funcDeclare = symbols.GetFunctionSymbol(name, funcName)

                If symbols.IsAnyObject(name) Then
                    ' 是对对象实例的方法引用
                    argumentFirst = target.ValueExpression(symbols)
                    leftArguments = funcDeclare.Parameters.Skip(1).ToArray
                ElseIf name Like symbols.ModuleNames Then
                    ' 是对静态模块的方法引用
                    argumentFirst = Nothing
                    leftArguments = funcDeclare.Parameters
                End If
            Else
                Throw New NotImplementedException
            End If

            Dim arguments As Expression() = argumentList.fillParameters(leftArguments, symbols)

            If Not argumentFirst Is Nothing Then
                arguments = argumentFirst _
                    .Join(arguments) _
                    .ToArray
            End If

            Return New FuncInvoke(funcDeclare.Name) With {
                .Parameters = arguments
            }
        End Function

        <Extension>
        Private Function fillParameters(argumentList As ArgumentListSyntax, funcDeclare As NamedValue(Of String)(), symbols As SymbolTable) As Expression()
            Dim arg As NamedValue(Of String)
            Dim input As ArgumentSyntax = Nothing
            Dim arguments As New List(Of Expression)
            Dim invokeInputs As ArgumentSyntax()

            If argumentList Is Nothing Then
                invokeInputs = {}
            Else
                invokeInputs = argumentList _
                    .ArgumentSequence(funcDeclare) _
                    .ToArray
            End If

            For i As Integer = 0 To funcDeclare.Length - 1
                arg = funcDeclare(i)
                input = invokeInputs.ElementAtOrNull(i)

                If input Is Nothing Then
                    ' 可选参数的默认值是一个常量
                    If arg.Value = "char*" Then
                        arguments += symbols.StringConstant(arg.Description)
                    Else
                        arguments += New LiteralExpression With {
                            .type = arg.Value,
                            .value = arg.Description
                        }
                    End If
                Else
                    arguments += input.Argument(symbols, arg)
                End If
            Next

            Return arguments
        End Function

        <Extension>
        Public Function InvokeFunction(symbols As SymbolTable, funcName$, argumentList As ArgumentListSyntax) As Expression
            Dim funcDeclare = symbols.GetFunctionSymbol(Nothing, funcName)

            If JavaScriptImports.Array.IsArrayOperation(funcDeclare) Then
                ' 是一个数组元素的读取操作
                Dim array = New GetLocalVariable With {.var = funcName}
                Dim index As Expression = argumentList _
                    .Arguments _
                    .First _
                    .Argument(symbols, funcDeclare.Parameters.Last)

                Return New FuncInvoke With {
                    .Reference = funcDeclare.Name,
                    .Parameters = {array, index}
                }
            Else
                Dim arguments = argumentList.fillParameters(funcDeclare.Parameters, symbols)

                Return New FuncInvoke(funcName) With {
                    .Parameters = arguments
                }
            End If
        End Function

        <Extension>
        Private Iterator Function ArgumentSequence(arguments As ArgumentListSyntax, define As NamedValue(Of String)()) As IEnumerable(Of ArgumentSyntax)
            Dim input = arguments.Arguments.ToArray
            Dim a As ArgumentSyntax
            Dim check As NamedValue(Of String)

            For i As Integer = 0 To define.Length - 1
                a = input.ElementAtOrNull(i)
                check = define(i)

                If a Is Nothing Then
                    ' 可能是一个a:=...，并且出现在前面或者后面
                    a = input _
                        .FirstOrDefault(Function(arg)
                                            Return arg.IsNamed AndAlso DirectCast(arg, SimpleArgumentSyntax) _
                                                .NameColonEquals _
                                                .Name _
                                                .objectName _
                                                .TextEquals(check.Name)
                                        End Function)
                    Yield a
                Else
                    If DirectCast(a, SimpleArgumentSyntax).NameColonEquals Is Nothing Then
                        Yield a
                    Else
                        a = input _
                            .FirstOrDefault(Function(arg)
                                                Return arg.IsNamed AndAlso DirectCast(arg, SimpleArgumentSyntax) _
                                                    .NameColonEquals _
                                                    .Name _
                                                    .objectName _
                                                    .TextEquals(check.Name)
                                            End Function)
                        Yield a
                    End If
                End If
            Next
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        <Extension>
        Public Function ReferVariable(name As IdentifierNameSyntax, symbols As SymbolTable) As Expression
            Dim var As String = name.objectName

            If symbols.IsLocal(var) Then
                Return New GetLocalVariable With {
                    .var = var
                }
            Else
                Return New GetGlobalVariable With {
                    .var = var
                }
            End If
        End Function

        ''' <summary>
        ''' 
        ''' </summary>
        ''' <param name="[const]"></param>
        ''' <param name="wasmType"></param>
        ''' <param name="memory">内存设备</param>
        ''' <returns></returns>
        <Extension>
        Public Function ConstantExpression([const] As LiteralExpressionSyntax, wasmType$, memory As SymbolTable) As Expression
            Dim value As Object = [const].Token.Value
            Dim type As Type

            If value Is Nothing Then
                ' 是空值常量，则直接返回整形数0表示空指针
                value = 0
                type = GetType(Integer)
            Else
                type = value.GetType
            End If

            If type Is GetType(String) OrElse type Is GetType(Char) Then
                Return memory.StringConstant(value)
            ElseIf type Is GetType(Boolean) Then
                wasmType = "i32"
                value = If(DirectCast(value, Boolean), 1, 0)
            Else
                If wasmType.StringEmpty Then
                    wasmType = Types.Convert2Wasm(type)
                End If
            End If

            Return New LiteralExpression With {
                .type = wasmType,
                .value = value
            }
        End Function

        <Extension>
        Public Function StringConstant(memory As SymbolTable, str As String) As LiteralExpression
            Dim intPtr As Object = str
            Dim wasmType$ = Nothing

            Call memory.stringValue(intPtr, wasmType)

            Return New LiteralExpression With {
               .type = wasmType,
               .value = intPtr
            }
        End Function

        <Extension>
        Public Function ParenthesizedStack(parenthesized As ParenthesizedExpressionSyntax, symbols As SymbolTable) As Parenthesized
            Return New Parenthesized With {
                .Internal = parenthesized.Expression.ValueExpression(symbols)
            }
        End Function

        ''' <summary>
        ''' NOTE: div between two integer will convert to double div automatic. 
        ''' </summary>
        ''' <param name="expression"></param>
        ''' <param name="symbols"></param>
        ''' <returns></returns>
        <Extension>
        Public Function BinaryStack(expression As BinaryExpressionSyntax, symbols As SymbolTable) As Expression
            Dim left = expression.Left.ValueExpression(symbols)
            Dim right = expression.Right.ValueExpression(symbols)
            Dim op$ = expression.OperatorToken.ValueText

            Return BinaryStack(left, right, op, symbols)
        End Function

        ''' <summary>
        ''' NOTE: div between two integer will convert to double div automatic. 
        ''' </summary>
        ''' <param name="symbols"></param>
        ''' <returns></returns>
        Public Function BinaryStack(left As Expression, right As Expression, op$, symbols As SymbolTable) As Expression
            Dim type$

            If op = "/" Then
                ' require type conversion if left and right is integer
                ' 对于除法，必须要首先转换为浮点型才能够完成运算
                left = Types.CDbl(left, symbols)
                right = Types.CDbl(right, symbols)
                type = "f64"
            ElseIf op = "&" Then
                Return symbols.StringAppend(left, right)
            Else
                ' 其他的运算符则需要两边的类型保持一致
                ' 往高位转换
                ' i32 -> f32 -> i64 -> f64
                Dim lt = left.TypeInfer(symbols)
                Dim rt = right.TypeInfer(symbols)
                Dim li = Types.Orders.IndexOf(lt)
                Dim ri = Types.Orders.IndexOf(rt)

                If li > ri Then
                    type = lt
                Else
                    type = rt
                End If

                left = Types.CType(type, left, symbols)
                right = Types.CType(type, right, symbols)
            End If

            Dim funcOpName$

            If Types.Operators.ContainsKey(op) Then
                funcOpName = Types.Operators(op)
                funcOpName = $"{type}.{funcOpName}"
            Else
                funcOpName = Types.Compares(type, op)
            End If

            ' 需要根据类型来决定操作符函数的类型来源
            Return New FuncInvoke With {
                .Parameters = {left, right},
                .Reference = funcOpName,
                .[operator] = True
            }
        End Function
    End Module
End Namespace
