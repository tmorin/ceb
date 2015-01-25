'use strict';
window.MySupperButton = ceb()
    .name('my-supper-button')
    .extends('button')
    .prototype(Object.create(HTMLButtonElement.prototype))
    .properties({
        iconClass: {
            attribute: true,
            setter: function (el, value) {
                el.querySelector('i').setAttribute('class', value);
                return value;
            },
            getter: function (el, value) {
                return el.querySelector('i').getAttribute('class');
            }
        },
        label: {
            attribute: true,
            delegate: {
                target: 'span',
                property: 'textContent'
            }
        },
        conf: {
            set: function (el, conf) {
                if (conf && conf.hasOwnProperty('iconClass')) {
                    el.iconClass = conf.iconClass;
                }
                if (conf && conf.hasOwnProperty('label')) {
                    el.label = conf.label;
                }
            },
            get: function (el) {
                return {
                    iconClass: el.iconClass,
                    label: el.label
                };
            }
        }
    })
    .methods({
        createdCallback: function (el) {
            el.innerHTML = '<i></i> <span></span>';
        }
    })
    .register();
