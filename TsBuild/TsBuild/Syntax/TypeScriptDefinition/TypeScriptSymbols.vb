﻿#Region "Microsoft.VisualBasic::d07c5c117712c55157624cc983e76550, typescript\Linq.ts\TsBuild\TsBuild\Syntax\TypeScriptDefinition\TypeScriptSymbols.vb"

    ' Author:
    ' 
    '       asuka (amethyst.asuka@gcmodeller.org)
    '       xie (genetics@smrucc.org)
    '       xieguigang (xie.guigang@live.com)
    ' 
    ' Copyright (c) 2018 GPL3 Licensed
    ' 
    ' 
    ' GNU GENERAL PUBLIC LICENSE (GPL3)
    ' 
    ' 
    ' This program is free software: you can redistribute it and/or modify
    ' it under the terms of the GNU General Public License as published by
    ' the Free Software Foundation, either version 3 of the License, or
    ' (at your option) any later version.
    ' 
    ' This program is distributed in the hope that it will be useful,
    ' but WITHOUT ANY WARRANTY; without even the implied warranty of
    ' MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    ' GNU General Public License for more details.
    ' 
    ' You should have received a copy of the GNU General Public License
    ' along with this program. If not, see <http://www.gnu.org/licenses/>.



    ' /********************************************************************************/

    ' Summaries:

    ' Module TypeScriptSymbols
    ' 
    '     Properties: Keywords
    ' 
    ' /********************************************************************************/

#End Region

Imports Microsoft.VisualBasic.ComponentModel.Collection

Module TypeScriptSymbols

    ''' <summary>
    ''' The typescript keywords
    ''' </summary>
    ''' <returns></returns>
    Public ReadOnly Property Keywords As Index(Of String) = {
        "declare", "namespace", "module", "function", "void",
        "interface", "protected", "constructor", "extends",
        "private", "public", "export", "static"
    }

End Module

