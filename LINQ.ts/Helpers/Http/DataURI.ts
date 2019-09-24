interface DataURI {

    mime_type: string;
    /**
     * base64 string or array buffer blob
    */
    data: string | ArrayBuffer;
}