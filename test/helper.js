import $ from 'jquery';

function isIe() {
    return navigator.userAgent.indexOf('MSIE 9.0') > -1 ||
        navigator.userAgent.indexOf('MSIE 10.0') > -1 ||
        navigator.userAgent.indexOf('Trident/7.0') > -1;
}

function isPhantom() {
    return navigator.userAgent.indexOf('PhantomJS') > -1;
}

function isFirefox() {
    return navigator.userAgent.indexOf('Firefox') > -1;
}

function isSafari() {
    return navigator.userAgent.indexOf('Macintosh') > -1 &&
        (
            navigator.userAgent.indexOf('Version/7.') > -1 ||
            navigator.userAgent.indexOf('Version/8.') > -1
        );
}

function isAndroid4() {
    return navigator.userAgent.indexOf('Android 4') > -1;
}

export function canClick() {
    return !(isIe() || isPhantom() || isFirefox() || isSafari() || isAndroid4());
}

export function click(el) {
    $(el).trigger('click');
}
