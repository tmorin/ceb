import {ceb, property, attribute} from '../../es6/lib/ceb.js';
import {toArray, isNull, isUndefined} from '../../es6/lib/utils.js';

function getElementValue(element) {
    if (element.type === 'time' || element.type === 'date') {
        return 'valueAsDate' in element ? element.valueAsDate : new Date(element.value);
    } else if (element.type === 'range' || element.type === 'number') {
        return parseFloat(element.value);
    } else if (element.type === 'checkbox' || element.type === 'radio') {
        return element.checked ? element.value : undefined;
    } else {
        return element.value;
    }
}

function setElementValue(element, value) {
    if (element.type === 'time' || element.type === 'date') {
        if ('valueAsDate' in element) {
            element.valueAsDate = value;
        } else if (value) {
            let isoValue = value.toISOString();
            element.value = isoValue.substring(0, isoValue.indexOf('T'));
        }
    } else if (element.type === 'range' || element.type === 'number') {
        element.value = value;
    } else if (element.type === 'checkbox' || element.type === 'radio') {
        element.checked = element.value === value;
    } else {
        element.value = isNull(value) || isUndefined(value) ? '' : value;
    }
}

function setObjectValue(object, path, value) {
    let props = path.split('.');
    let iMax = props.length;
    let current = object;
    let i = 0;
    for (; i < iMax - 1; i++) {
        let prop = props[i];
        if (!current[prop]) {
            current[prop] = {};
        }
        current = current[prop];
    }
    current[props[i]] = value;
}

function getObjectValue(object, path) {
    let props = path.split('.');
    let iMax = props.length;
    let current = object;
    let i = 0;
    for (; i < iMax; i++) {
        current = current[props[i]];
    }
    return current;
}

function objectToForm(form, object) {
    let elements = toArray(form.querySelectorAll('[name]'));
    elements.forEach(element => {
        let path = element.name;
        let value = getObjectValue(object, path);
        setElementValue(element, value);
    });
}

function formToObject(form) {
    let result = {};
    let elements = toArray(form.querySelectorAll('[name]'));
    elements.forEach(element => {
        let path = element.name;
        let value = getElementValue(element);
        if (!isUndefined(value)) {
            setObjectValue(result, path, value);
        }
    });
    return result;
}
export default ceb().proto(Object.create(HTMLFormElement.prototype)).extend('form').builders(
    attribute('prevent-submit')
        .boolean()
        .listen((el, oldValue, newValue) => el.setAttribute('onsubmit', newValue ? 'return false;' : '')),

    property('valueAsObject').setter(objectToForm).getter(formToObject),

    property('namedElements').getter(el => toArray(el.querySelectorAll('[name]')))
).register('wui-form');

