import $ from 'jquery';
import 'bootstrap';
import {ceb, method, template, attribute, delegate, on} from 'es6/lib/ceb.js';
import {baconify, trigger} from '../builders/baconify.js';
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
        <div class="input-group">
            <input type="text" placeholder="a place" class="form-control" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span class="input-group-btn">
                <button type="button" class="btn btn-default">
                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
               </button>
            </span>
        </div>
        <div style="display: none;">
            <ul class="list-unstyled suggestions-container"></ul>
        </div>
    `),

    method('attachedCallback').invoke(el => {
        el.$ = $(el);
        el._suggestionsContainer = el.querySelector('.suggestions-container');
        $(el._suggestionsContainer).on('click', 'li', function () {
            trigger(el, {
                name: 'value',
                bubbles: true,
                cancellable: true
            }, $(this).attr('value'));
        });
        el.$.popover({
            html: true,
            trigger: 'manual',
            placement: 'bottom',
            title: '',
            content: function () {
                return $(el._suggestionsContainer);
            }
        });
    }),

    method('detachedCallback').invoke(el => {
        el.$input.popover('destroy');
    }),

    /* Form elements' facade */

    // the focus of the custom element is hosted by the text input
    delegate(method('focus')).to('input[type=text]'),

    // the value of the custom element is hosted by the text input
    delegate(attribute('value')).to('input[type=text]').property(),

    // the value could be get from an HTML form
    delegate(attribute('name')).to('input[type=text]'),

    // the disabled state of the custom element
    // is hosted by the text input
    // alternatively, the clear button must be handled too
    delegate(attribute('disabled').setter((el, value) => {
        el.querySelector('button[type=button]').disabled = value;
        return value;
    })).to('input[type=text]').property(),

    // like the disabled state
    delegate(attribute('readonly').setter((el, value) => {
        el.querySelector('button[type=button]').disabled = value;
        return value;
    })).to('input[type=text]').property(),

    /* Autocomplete's logic */

    /* When the clear button is clicked, the value should be empty */
    baconify(on('click').delegate('button[type=button]'))
        .apply((el, stream) => stream.map(() => ''))
        .trigger('value'),

    /* When the input get new input, suggestions should be fetched */
    baconify(on('input').delegate('input[type=text]'))
        .apply((el, stream) => {
            let query = stream.debounce(300).map(evt => evt.target.value);
            let suggestions = query.flatMapLatest(getPlaces);
            query.awaiting(suggestions)
                .filter(value => value).onValue(() => el._suggestionsContainer.innerHTML = 'Searching ...');
            return suggestions;
        })
        .trigger('suggestions'),

    /* When suggestions are fetched or overridden, they should be displayed */
    baconify(on('suggestions'))
        .apply((el, stream) => {
            stream
                .map(evt => evt.detail)
                .onValue(results => {
                    if (!results) {
                        el._suggestionsContainer.innerHTML = '';
                        el.$.popover('hide');
                    } else if (results.length > 0) {
                        el._suggestionsContainer.innerHTML = results
                            .map(result => `<li value="${result.display_name}">${result.display_name}</li>`)
                            .join('');
                        el.$.popover('show');
                    } else {
                        el._suggestionsContainer.innerHTML = 'No results found ...';
                        el.$.popover('show');
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
                    let selected = el._suggestionsContainer.querySelector('li[marked]'),
                        lis = el._suggestionsContainer.querySelectorAll('li');
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
                .filter(evt => getKeyCode(evt) === 13 && el._suggestionsContainer.querySelector('li[marked]'))
                .doAction('.preventDefault')
                .map(() => el._suggestionsContainer.querySelector('li[marked]'))
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
