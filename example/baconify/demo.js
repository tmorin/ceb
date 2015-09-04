import $ from 'jquery';
import {ceb, method, template, attribute, delegate, on} from 'es6/lib/ceb.js';
import {baconify} from './baconify.js';
import {fromPromise, once} from 'bacon';

$.support.cors = true;

/**
 * Get places from a query.
 * If the query is falsy, the stream's value will be <code>null</code>.
 * @param {string} [query] the query
 * @returns {Bacon.EventStream} the stream of places
 */
function getPlaces(query) {
    return !query ? once(null) : fromPromise($.ajax('http://nominatim.openstreetmap.org/search', {
        crossDomain: true,
        dataType: 'json',
        method: 'GET',
        data: {
            format: 'json',
            limit: '10',
            q: query
        }
    }));
}

/**
 * Get the keyCode from an event.
 * @param {!Event} evt the event
 * @return {number} the key code value
 */
function getKeyCode(evt) {
    return (window.event ? window.event : evt).keyCode;
}

/**
 * The <code>CebAddressSelector</code> element.
 */
export default ceb().augment(
    template(`
        <input type="text" placeholder="a place">
        <input type="button" value="X">
        <ul></ul>
    `),

    /* Form elements' facade */

    delegate(method('focus')).to('input[type=text]'),

    delegate(attribute('value')).to('input[type=text]').property(),

    delegate(attribute('name')).to('input[type=text]'),

    delegate(attribute('disabled').setter((el, value) => {
        el.querySelector('input[type=button]').disabled = value;
        return value;
    })).to('input[type=text]').property(),

    delegate(attribute('readonly').setter((el, value) => {
        el.querySelector('input[type=button]').disabled = value;
        return value;
    })).to('input[type=text]').property(),

    /* Autocomplete's logic */

    /* When the clear button is clicked, the value should be empty */
    baconify(on('click').delegate('input[type=button]'))
        .apply((el, stream) => stream.map(() => ''))
        .trigger('value'),

    /* When the input get new input, suggestions should be fetched */
    baconify(on('input').delegate('input[type=text]'))
        .apply((el, stream) => {
            let query = stream.debounce(300).map(evt => evt.target.value);
            let suggestions = query.flatMapLatest(getPlaces);
            query.awaiting(suggestions)
                .filter(value => value).onValue(() => el.querySelector('ul').innerHTML = 'Searching ...');
            return suggestions;
        })
        .trigger('suggestions'),

    /* When suggestions are fetched or overridden, they should be displayed */
    baconify(on('suggestions'))
        .apply((el, stream) => {
            stream
                .map(evt => evt.detail)
                .onValue(results => {
                    let ul = el.querySelector('ul');
                    if (!results) {
                        ul.innerHTML = '';
                    } else if (results.length > 0) {
                        ul.innerHTML = results
                            .map(result => `<li value="${result.display_name}">${result.display_name}</li>`)
                            .join('');
                    } else {
                        ul.innerHTML = 'No results found ...';
                    }
                });
        }),

    /* When up and down arrows are pressed, the marked suggestion should be updated */
    baconify(on('keydown'))
        .apply((el, stream) => {
            let actionsMapping = {
                38: 'previous',
                40: 'next'
            };
            stream
                .filter(evt => actionsMapping.hasOwnProperty(getKeyCode(evt)))
                .doAction('.preventDefault')
                .map(evt => actionsMapping[getKeyCode(evt)])
                .map(action => {
                    let selected = el.querySelector('ul li[marked]'),
                        lis = el.querySelectorAll('ul li');
                    if (selected) {
                        selected.removeAttribute('marked');
                    }
                    if (lis.length > 0) {
                        if (action === 'previous') {
                            return selected && selected.previousSibling ? selected.previousSibling : lis.item(lis.length - 1);
                        }
                        return selected && selected.nextSibling ? selected.nextSibling : lis.item(0);
                    }
                })
                .filter(li => li)
                .onValue(li => li.setAttribute('marked', ''));
        }),

    /* When enter is pressed, the marked suggestion should be the value */
    baconify(on('keydown'))
        .apply((el, stream) => {
            return stream
                .filter(evt => getKeyCode(evt) === 13 && el.querySelector('ul li[marked]'))
                .doAction('.preventDefault')
                .map(() => el.querySelector('ul li[marked]'))
                .map(li => li.getAttribute('value'));
        })
        .trigger('value'),

    /* When a suggestion is selected, the suggestion should be the value */
    baconify(on('click').delegate('ul li').skip())
        .apply((el, stream) => stream.map(evt => evt.target.getAttribute('value')))
        .trigger('value'),

    /* When the value is updated, the suggestion should be cleared and the input focused */
    baconify(on('value'))
        .apply((el, stream) => {
            stream.map(evt => evt.detail).onValue(value => {
                el.value = value;
                el.focus();
            });
            return stream.map(() => null);
        })
        .trigger('suggestions')
).register('ceb-address-selector');
