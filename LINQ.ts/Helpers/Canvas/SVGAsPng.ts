namespace CanvasHelper.saveSvgAsPng {

    // var out$ = typeof exports != 'undefined' && exports || typeof define != 'undefined' && {} || this;

    export const doctype: string = `
        <?xml version="1.0" standalone="no"?>
            <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [<!ENTITY nbsp "&#160;">]>`;

    export const xlink: string = "http://www.w3.org/1999/xlink";

    export function isElement(obj: any): boolean {
        return obj instanceof HTMLElement || obj instanceof SVGElement;
    }

    export function requireDomNode(el: any): void {
        if (!isElement(el)) {
            throw new Error('an HTMLElement or SVGElement is required; got ' + el);
        }
    }

    export function isExternal(url): boolean {
        return url && url.lastIndexOf('http', 0) == 0 && url.lastIndexOf(window.location.host) == -1;
    }

    export function inlineImages(el: HTMLElement, callback: () => void) {
        requireDomNode(el);

        var images: NodeListOf<SVGImageElement> = el.querySelectorAll('image');
        var left: number = images.length;
        var checkDone = function (count: number) {
            if (count === 0) {
                callback();
            }
        };

        checkDone(left);

        for (var i: number = 0; i < images.length; i++) {
            left = renderInlineImage(images[i], left, checkDone);
        }
    }

    function renderInlineImage(image: SVGImageElement, left: number, checkDone: (left: number) => void): number {
        var href = image.getAttributeNS(saveSvgAsPng.xlink, "href");

        if (href) {
            if (typeof href != "string") {
                href = (<any>href).value;
            }

            if (isExternal(href)) {
                console.warn("Cannot render embedded images linking to external hosts: " + href);
                return;
            }
        }

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = new Image();

        img.crossOrigin = "anonymous";
        href = href || image.getAttribute('href');

        if (href) {
            img.src = href;
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                image.setAttributeNS(saveSvgAsPng.xlink, "href", canvas.toDataURL('image/png'));
                left--;
                checkDone(left);
            }
            img.onerror = function () {
                console.error("Could not load " + href);
                left--;
                checkDone(left);
            }
        } else {
            left--;
            checkDone(left);
        }

        return left;
    }

    class Options {
        public selectorRemap;
        public modifyStyle;
    }

    class styles {

        public doStyles(el, options: Options, cssLoadedCallback) {
            var selectorRemap = options.selectorRemap;
            var modifyStyle = options.modifyStyle;
            var css: string = "";
            // each font that has extranl link is saved into queue, and processed
            // asynchronously
            var fontsQueue = [];
            var sheets: StyleSheetList = document.styleSheets;

            for (var i = 0; i < sheets.length; i++) {
                try {
                    var rules = sheets[i].cssRules;
                } catch (e) {
                    console.warn("Stylesheet could not be loaded: " + sheets[i].href);
                    continue;
                }

                if (rules != null) {
                    this.processCssRules(rules);
                }
            }

            // Now all css is processed, it's time to handle scheduled fonts
            processFontQueue(fontsQueue);
        }

        private processCssRules(rules): void {
            for (var j = 0, match; j < rules.length; j++ , match = null) {
                var rule = rules[j];
                if (typeof (rule.style) != "undefined") {
                    var selectorText;

                    try {
                        selectorText = rule.selectorText;
                    } catch (err) {
                        console.warn('The following CSS rule has an invalid selector: "' + rule + '"', err);
                    }

                    try {
                        if (selectorText) {
                            match = el.querySelector(selectorText) || el.parentNode.querySelector(selectorText);
                        }
                    } catch (err) {
                        console.warn('Invalid CSS selector "' + selectorText + '"', err);
                    }

                    if (match) {
                        var selector = selectorRemap ? selectorRemap(rule.selectorText) : rule.selectorText;
                        var cssText = modifyStyle ? modifyStyle(rule.style.cssText) : rule.style.cssText;
                        css += selector + " { " + cssText + " }\n";
                    } else if (rule.cssText.match(/^@font-face/)) {
                        // below we are trying to find matches to external link. E.g.
                        // @font-face {
                        //   // ...
                        //   src: local('Abel'), url(https://fonts.gstatic.com/s/abel/v6/UzN-iejR1VoXU2Oc-7LsbvesZW2xOQ-xsNqO47m55DA.woff2);
                        // }
                        //
                        // This regex will save extrnal link into first capture group
                        var fontUrlRegexp = /url\(["']?(.+?)["']?\)/;
                        // TODO: This needs to be changed to support multiple url declarations per font.
                        var fontUrlMatch = rule.cssText.match(fontUrlRegexp);

                        var externalFontUrl = (fontUrlMatch && fontUrlMatch[1]) || '';
                        var fontUrlIsDataURI = externalFontUrl.match(/^data:/);
                        if (fontUrlIsDataURI) {
                            // We should ignore data uri - they are already embedded
                            externalFontUrl = '';
                        }

                        if (externalFontUrl === 'about:blank') {
                            // no point trying to load this
                            externalFontUrl = '';
                        }

                        if (externalFontUrl) {
                            // okay, we are lucky. We can fetch this font later

                            //handle url if relative
                            if (externalFontUrl.startsWith('../')) {
                                externalFontUrl = sheets[i].href + '/../' + externalFontUrl
                            } else if (externalFontUrl.startsWith('./')) {
                                externalFontUrl = sheets[i].href + '/.' + externalFontUrl
                            }

                            fontsQueue.push({
                                text: rule.cssText,
                                // Pass url regex, so that once font is downladed, we can run `replace()` on it
                                fontUrlRegexp: fontUrlRegexp,
                                format: getFontMimeTypeFromUrl(externalFontUrl),
                                url: externalFontUrl
                            });
                        } else {
                            // otherwise, use previous logic
                            css += rule.cssText + '\n';
                        }
                    }
                }
            }
        }
    }
}