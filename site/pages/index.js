// # Custom Elements Builder
//
// **ceb** is a builder to help the development of Custom Elements.
//
// - The project is hosted on [Github](https://github.com/tmorin/custom-elements-builder)
// - Every use cases are tested and validated from this [test suite](./testsuite)
// - The source code is continuously built on [Travis](https://travis-ci.org/tmorin/custom-elements-builder)
// - The test suite is automatically executed using [Sauce Labs](https://saucelabs.com/u/customelementbuilder)
// - The code coverage report is pushed to [coveralls](https://coveralls.io/r/tmorin/custom-elements-builder)
// - [Change logs](changelogs.html)
// ***
// ## Documentation
// - [0.2.x](0.2.x/doc.1.usage.html)
// - [0.1.x](0.1.x/doc.1.usage.html)
//
// - [ceb.js](ceb.html)
// - [ceb-feature-template.js](ceb-feature-template.html)
// - [ceb-feature-frp.js](ceb-feature-frp.html)
// ***
// ## Compatibilities
// [![Sauce Test Status](https://saucelabs.com/browser-matrix/customelementbuilder.svg)](https://saucelabs.com/u/customelementbuilder)
//
// **ceb** should and will work without dependencies on evergreen browsers.
// However for the others like IE9/IE10 you have to use a [Custom Elements](http://www.w3.org/TR/custom-elements/) polyfill like:
// - webcomponents-lite.js from [webcomponents.org](http://webcomponents.org/polyfills/)
// - or [document-register-element](https://github.com/WebReflection/document-register-element)
// ***
// ## CDN
// CDN files can be found on [cdnjs](https://cdnjs.com/libraries/custom-elements-builder)
//
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements-builder/0.2.2/ceb.min.js"></script>
//
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements-builder/0.2.2/ceb-feature-template.min.js"></script>
//
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements-builder/0.2.2/ceb-feature-frp.min.js"></script>
//
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements-builder/0.2.2/ceb-feature-frp-rx.min.js"></script>
//
// ***
// ## Installation
// - npm: `npm install ceb --save`
// - bower: `npm bower ceb --save`
// - amd: `require(['ceb', ...`
// - amd: `require(['ceb-feature-template', ...`
// - amd: `require(['ceb-feature-frp', ...`
// - amd: `require(['ceb-feature-frp-rx', ...`

/*
 * The place-finder element is used to find a place.
 * Its value is the latitude and longitude of a place.
 * The user can find a place using the search field then select a result to update the element's value.
 * Found places and value are displayed into a map.
 * You can play with it on jsfiddle: http://jsfiddle.net/tmorin/xce2e756
 */

function setupMap(el) {
    /* setup the map if needed */
}
function destroyMap(el) {
    /* destroy the map */
}

var spyQuery = cebFeatureFrp.disposable(function (el) {
    return window.Rx.Observable.fromEvent(cebFeatureTemplate(el).query, 'keyup').map(function (evt) {
        return evt.target.value;
    }).distinctUntilChanged();
}).handlers(function (el, observer) {
    observer.subscribe(function (query) {
        el.query = query;
    });
});

var spyPlaces = cebFeatureFrp.disposable(function (el) {
    return window.Rx.Observable.fromEvent(cebFeatureTemplate(el).places, 'change').map(function (evt) {
        return evt.target.value;
    }).distinctUntilChanged();
}).handlers(function (el, observer) {
    observer.subscribe(function (value) {
        el.value = value;
    });
});

var searchPlaces = cebFeatureFrp.disposable(function (el) {
    return el.queryObserver.throttle(300).map(function (query) {
        return query;
    }).flatMapLatest(function (query) {
        /* call web service to find a list of places */
    });
}).handlers(function (el, observer) {
    observer.subscribe(function (places) {
        el.places = places;
    });
});

var displayPlacesInList = cebFeatureFrp.disposable(function (el) {
    return el.placesObserver;
}).handlers(function (el, observer) {
    observer.subscribe(function (places) {
        /* when places are found, they should be displayed into the select */
    });
});

var displayPlacesInMap = cebFeatureFrp.disposable(function (el) {
    return el.placesObserver;
}).handlers(function (el, observer) {
    observer.subscribe(function (places) {
        /* when places are found, they should be displayed into the map */
    });
});

var displayValueInMap = cebFeatureFrp.disposable(function (el) {
    return el.valueObserver.map(function (value) {
        return value.split(',');
    });
}).handlers(function (el, observer) {
    observer.subscribe(function (coord) {
        /* when a value is set, it should be displayed into the map*/
    });
});

var cebSelectCountryTpl = '';
cebSelectCountryTpl += '<input type="hidden" ceb-ref="value">';
cebSelectCountryTpl += '<input type="text" ceb-ref="query" placeholder="type a place">';
cebSelectCountryTpl += '<select ceb-ref="places" size="21"></select>';
cebSelectCountryTpl += '<section ceb-ref="map"></section>';

ceb()
    .name('place-finder')
    .feature(cebFeatureTemplate, {
        template: cebSelectCountryTpl
    })
    .feature(cebFeatureFrp, {
        disposables: [
            spyQuery,
            spyPlaces,
            searchPlaces,
            displayPlacesInList,
            displayPlacesInMap,
            displayValueInMap
        ]
    })
    .methods({
        createdCallback: setupMap,
        insertedCallback: setupMap,
        detachedCallback: destroyMap
    })
    .properties({
        query: {
            attribute: true,
            observable: true,
            delegate: {
                target: 'input[type="text"]',
                property: 'value'
            }
        },
        places: {
            observable: true
        },
        name: {
            attribute: true,
            delegate: {
                target: 'input[type="hidden"]'
            }
        },
        value: {
            attribute: true,
            observable: true,
            delegate: {
                target: 'input[type="hidden"]'
            }
        }
    })
    .register();
