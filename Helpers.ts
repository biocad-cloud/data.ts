module LinqHelpers {

    export function POST(url: string, postData: PostData, callback: (response: string) => void) {
        var http = new XMLHttpRequest();
        var data: any = postData.data;

        http.open('POST', url, true);
        // Send the proper header information along with the request
        http.setRequestHeader('Content-type', postData.type);
        // Call a function when the state changes.
        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                callback(http.responseText);
            }
        }
        http.send(data);
    }

    export function UploadFile(url: string, postData: PostData, callback: (response: string) => void) {

    }

    export class PostData {

        /**
         * content type
        */
        public type: string;
        public data: any;

        public toString(): string {
            return this.type;
        }
    }
}