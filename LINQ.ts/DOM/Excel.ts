namespace DOM.Excel {

    export const contentType: string = "application/vnd.ms-excel";

    /**
     * Download the excel table file
     * 
     * just use the download attribute of the given &lt;a> tag as the file name.
     * this function call the ``excel`` function for make the table download
    */
    export function attatchDownload(a: HTMLAnchorElement, table: string | HTMLTableElement, sheetName: string = "Sheet1", filters: string[] = null) {
        excel(<any>(typeof table == "string" ? $ts(table) : table), a.download, sheetName, filters);
    }

    /**
     * Download the excel table file
     * 
     * @param table should be a html table tag element object or a typescript dataframe object.
    */
    export function excel(table: HTMLTableElement | csv.dataframe, fileName: string, sheetName: string, filters: string[] = null) {
        let html: string = null;

        if (table instanceof HTMLTableElement) {
            html = ToExcel(table, sheetName, filters);
        } else {
            html = csv.HTML.toHTMLTable(table);
        }

        DOM.download(fileName, <DataURI>{
            mime_type: Excel.contentType,
            data: Base64.encode(html)
        });
    }

    export function ToExcel(table: HTMLTableElement, sheetName: string, filters: string[] = null): string {
        return excelHtml(() => ToHtml(table, filters), sheetName);
    }

    /**
     * @param table a delegate function for get table html string
    */
    export function excelHtml(table: Delegate.Func<string>, sheetName: string): string {
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
        html.AppendLine(table());
        html.AppendLine(`</body>`);
        html.AppendLine(`</html>`);

        return html.toString();
    }

    export function ToHtml(table: HTMLTableElement, filters: string[] = null): string {
        let html = new StringBuilder("", "\n");
        let body = table.tBodies.item(0);
        let theader = table.tHead.rows.item(0);

        html.AppendLine(tagOpenWithCssStyle(table));

        html.AppendLine(tagOpenWithCssStyle(table.tHead));
        html.AppendLine(rowHtml(theader, true))
        html.AppendLine("</thead>");

        html.AppendLine(tagOpenWithCssStyle(body));

        for (let i: number = 0; i < body.rows.length; i++) {
            html.AppendLine(rowHtml(body.rows.item(i), false))
        }

        html.AppendLine("</tbody>");

        html.AppendLine("</table>");

        return html.toString();
    }

    function tagOpenWithCssStyle(node: HTMLElement): string {
        let tagName: string = node.tagName.toLowerCase();
        let css: string = node.style.cssText;

        if (Strings.Empty(css, true)) {
            return `<${tagName}>`;
        } else {
            return `<${tagName} style="${css}">`;
        }
    }

    function rowHtml(row: HTMLTableRowElement, isTHead: boolean): string {
        let keyword: string = isTHead ? "th" : "td";
        let columns: string[] = [];

        for (let i: number = 0; i < row.cells.length; i++) {
            columns.push(`<${keyword}>${cellHtml(row.cells.item(i))}</${keyword}>`);
        }

        return `${tagOpenWithCssStyle(row)}${columns.join("")}</tr>`;
    }

    function cellHtml(cell: HTMLElement): string {
        let html: string = cell.innerHTML;

        // removes html form controls
        html = html.replace(/[<]\/?button([\s\S]*?)[>]/ig, "");
        html = html.replace(/[<]select([\s\S]*?)[<]\/select[>]/ig, "");

        // removes <script> code blocks
        // https://stackoverflow.com/questions/28889767/javascript-regex-to-match-multiple-lines
        html = html.replace(/[<]script([\s\S]*?)[<]\/script[>]/ig, "");

        // console.log(html);

        return html;
    }
}