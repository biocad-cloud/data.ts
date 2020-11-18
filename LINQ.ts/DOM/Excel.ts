namespace DOM.Excel {

    export const contentType: string = "application/vnd.ms-excel";

    export function excel(table: HTMLTableElement, fileName: string, sheetName: string) {
        DOM.download(fileName, <DataURI>{
            mime_type: Excel.contentType,
            data: Base64.encode(ToExcel(table, sheetName))
        });
    }

    export function ToExcel(table: HTMLTableElement, sheetName: string): string {
        let html = new StringBuilder("", "\n");

        html.AppendLine(`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`);
        html.AppendLine(`<head>`);
        html.AppendLine(`<meta name="ProgId" content="Excel.Sheet">`);
        html.AppendLine(`<meta name="Generator" content="Microsoft Excel 11">`);
        html.AppendLine(`<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">`);
        html.AppendLine(`    
<!--[if gte mso 9]>
	<xml>
		<x:ExcelWorkbook>
			<x:ExcelWorksheets>
				<x:ExcelWorksheet>
					<x:Name>${sheetName}</x:Name>
					<x:WorksheetOptions>
						<x:DisplayGridlines/>
					</x:WorksheetOptions>
				</x:ExcelWorksheet>
			</x:ExcelWorksheets>
		</x:ExcelWorkbook>
	</xml>
<![endif]-->
`);
        html.AppendLine(`</head>`);
        html.AppendLine(`<body>`);
        html.AppendLine(ToHtml(table));
        html.AppendLine(`</body>`);
        html.AppendLine(`</html>`);

        return html.toString();
    }

    export function ToHtml(table: HTMLTableElement): string {
        let html = new StringBuilder("", "\n");
        let body = table.tBodies.item(0);

        html.AppendLine("<table>");

        html.AppendLine("<thead>");
        html.AppendLine(rowHTML(table.tHead.rows.item(0), true))
        html.AppendLine("</thead>");

        html.AppendLine("<tbody>");

        for (let i: number = 0; i < body.rows.length; i++) {
            html.AppendLine(rowHTML(body.rows.item(i), false))
        }

        html.AppendLine("</tbody>");

        html.AppendLine("</table>");

        return html.toString();
    }

    function rowHTML(thead: HTMLTableRowElement, isThead: boolean): string {
        console.log(thead);
    }
}