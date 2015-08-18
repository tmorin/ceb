// Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 2.0.50727; SLCC2; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.3)
function isIe9() {
    return navigator.userAgent.indexOf('MSIE 9.0') > -1;
}

// Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.9.8 Safari/534.34
function isPhantom() {
    return navigator.userAgent.indexOf('PhantomJS') > -1;
}

// Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0
function isFirefox() {
    return navigator.userAgent.indexOf('Firefox') > -1;
}

export function canClick() {
    return !(isIe9() || isPhantom() || isFirefox());
}

export function click(el) {
    var evt = document.createEvent('MouseEvent');
    evt.initMouseEvent(
        'click',
        /*bubble*/true, /*cancelable*/true,
        window, null,
        0, 0, 0, 0, /*coordinates*/
        false, false, false, false, /*modifier keys*/
        0/*button=left*/, null
    );
    el.dispatchEvent(evt);
    return evt;
}
