namespace Internal.Handlers.Selector {

    export function getElementByIdUnderContext(id: string, context: Window | HTMLElement) {
        if ((TypeExtensions.checkENV() == ENV.browser) && context instanceof Window) {
            return (<Window>context).document.getElementById(id);
        } else {
            return (<any>context).getElementById(id);
        }
    }

    export function selectElementsUnderContext(query: DOM.Query, context: Window | HTMLElement) {
        if ((TypeExtensions.checkENV() == ENV.browser) && context instanceof Window) {
            return context
                .document
                .querySelector(query.expression);
        } else {
            return (<HTMLElement>context).querySelector(query.expression);
        }
    }
}