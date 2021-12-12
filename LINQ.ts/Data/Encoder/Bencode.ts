module Bencode {

    function decodeImpl(str: string): any[] {
        let arr, bencoded, cache$, cache$1, cursor, key, keyLength, obj, startPos, stringLength, value, valueLength;

        switch (str[0]) {
            case 'i':
                bencoded = str.match(/^i-?\d+e/)[0];
                return [
                    bencoded.length,
                    +bencoded.slice(1, -1)
                ];
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                stringLength = str.match(/^\d+/)[0];
                startPos = stringLength.length + 1;
                bencoded = str.slice(0, startPos + +stringLength);

                return [
                    bencoded.length,
                    bencoded.slice(startPos)
                ];
            case 'l':
                cursor = 1;
                arr = function (accum$) {
                    var cache$, entry, entryLength;
                    while (str[cursor] !== 'e') {
                        cache$ = decodeImpl(str.slice(cursor));
                        entryLength = cache$[0];
                        entry = cache$[1];
                        cursor += entryLength;
                        accum$.push(entry);
                    }
                    return accum$;
                }.call(this, []);

                return [
                    cursor + 1,
                    arr
                ];
            case 'd':
                cursor = 1;
                obj = {};

                while (str[cursor] !== 'e') {
                    cache$ = decodeImpl(str.slice(cursor));
                    keyLength = cache$[0];
                    key = cache$[1];
                    cache$1 = decodeImpl(str.slice(cursor + keyLength));
                    valueLength = cache$1[0];
                    value = cache$1[1];
                    cursor += keyLength + valueLength;
                    obj[key] = value;
                }

                return [
                    cursor + 1,
                    obj
                ];
        }
    }

    export function decode(str: string): any {
        return decodeImpl(str)[1];
    }

    export function encode(object: any): string {
        switch (false) {
            case !(typeof object === 'string'):
                return encodeString(object);
            case !(typeof object === 'number'):
                return encodeInteger(0 | object);
            case !('[object Array]' === {}.toString.call(object)):
                return encodeList(object);
            default:
                return encodeDictionary(object);
        }
    }

    function encodeString(s: string) {
        return '' + s.length + ':' + s;
    };
    function encodeInteger(i: number) {
        return 'i' + i + 'e';
    };
    function encodeList(array: any[]) {
        var encodedContents;
        encodedContents = function (accum$) {
            var object;
            for (var i$ = 0, length$ = array.length; i$ < length$; ++i$) {
                object = array[i$];
                accum$.push(encode(object));
            }
            return accum$;
        }.call(this, []).join('');
        return 'l' + encodedContents + 'e';
    };
    function encodeDictionary(object: {}) {
        var encodedContents, keys;
        keys = function (accum$) {
            var key;
            for (key in object) {
                if (!isOwn$(object, key))
                    continue;
                accum$.push(key);
            }
            return accum$;
        }.call(this, []).sort();
        encodedContents = function (accum$) {
            var key;
            for (var i$ = 0, length$ = keys.length; i$ < length$; ++i$) {
                key = keys[i$];
                accum$.push('' + encode(key) + encode(object[key]));
            }
            return accum$;
        }.call(this, []).join('');
        return 'd' + encodedContents + 'e';
    };

    function isOwn$(o, p) {
        return {}.hasOwnProperty.call(o, p);
    }
}