# custom-element-builder

[![Build Status](https://travis-ci.org/tmorin/custom-element-builder.svg)](https://travis-ci.org/tmorin/custom-element-builder)
[![Dependency Status](https://david-dm.org/tmorin/custom-element-builder.png)](https://david-dm.org/tmorin/custom-element-builder)
[![devDependency Status](https://david-dm.org/tmorin/custom-element-builder/dev-status.png)](https://david-dm.org/tmorin/custom-element-builder#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/tmorin/custom-element-builder/badge.svg)](https://coveralls.io/r/tmorin/custom-element-builder)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/customelementbuilder.svg)](https://saucelabs.com/u/customelementbuilder)

## Presentation

Custom Element Builder (ceb) is ... a builder for Custom Elements.

ceb provides some linked methods trying to make the development of custom elements easiest.

## Installation

    var properties = {
        iconClass: {
            attribute: true,
            set: function (el, value) {
                el.querySelector('i').setAttribute('class', value);
            },
            get: function () {
                return el.querySelector('i').getAttribute('class');
            }
        },
        label: {
            attribute: true,
            delegate: {
                target: 'span',
                property: 'textContent
            }
        },
        conf: {
            set: function (el, conf) {
                if (conf.hasOwnProperty('icon')) {
                    el.iconClass = conf.iconClass;
                }
                if (conf.hasOwnProperty('label')) {
                    el.label = conf.label;
                }
            },
            get: function (el) {
                return {
                    iconClass: el.iconClass,
                    label: el.label
                }
            }
        }
    };
    var methods = {
        createdCallback: function (el) {
            el.innerHTML = '<i></i> <span></span>';
        }
    };
    var MyComponent = ceb()
        .name('my-built-button)
        .extends('button')
        .prototype(Object.create(HTMLButtonElement.prototype))
        .properties(properties)
        .methods(methods)
        .register()

