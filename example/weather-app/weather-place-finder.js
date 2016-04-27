import {
    element,
    method,
    attribute,
    template,
    delegate,
    on,
    dispatchCustomEvent
} from 'ceb';

import {find} from './owm';

export const WeatherPlaceFinder = element().builders(
    template(`
        <div class="well">
            <form novalidate name="placeFinderForm" class="form-inline">
                <input type="text"
                    class="form-control"
                    name="query"
                    placeholder="London, Delhi, Brasilia, ..."
                    autocomplete="off">
                <button type="submit" class="btn btn-default">search</button>
            </form>
            <div class="results"></div>
        </div>
    `),

    delegate(method('focus')).to('input[name="query"]'),

    method('createdCallback').invoke(el => {
        el.style.display = 'none';
    }),

    attribute('shown').boolean().listen((el, oldVal, newVal) => el.style.display = newVal ? '' : 'none'),

    on('submit').delegate('form').invoke((el, evt) => {
        evt.preventDefault();
        let query = evt.target.query.value;
        if (query.length > 2) {
            let result = el.querySelector('.results');
            result.innerHTML = '<ul><li>Searching ...</li></ul>';
            find(query).then(data => {
                result.innerHTML = '';

                let frag = document.createDocumentFragment();

                let ul = document.createElement('ul');
                frag.appendChild(ul);

                data.list.filter(result => result.id > 0).map(result => {
                    let a = document.createElement('a');
                    a.textContent = `${result.name} (${result.sys.country})`;
                    a.setAttribute('data-locationId', result.id);
                    a.href = '#';
                    let li = document.createElement('li');
                    li.appendChild(a);
                    return li;
                }).forEach(li => ul.appendChild(li));

                if (ul.childNodes.length < 1) {
                    let li = document.createElement('li');
                    li.textContent = 'No result';
                    ul.appendChild(li);
                }

                result.appendChild(frag);
            }, xhr => {
                if (xhr) {
                    result.innerHTML = '<ul><li>Unable find locations.</li></ul>';
                }
            });
        }
    }),

    on('click').delegate('ul > li > a').invoke((el, evt) => {
        evt.preventDefault();
        dispatchCustomEvent(el, 'add-location', {
            detail: evt.target.getAttribute('data-locationId')
        });
        el.querySelector('form').query.value = '';
        el.querySelector('.results').innerHTML = '';
    })
).register('weather-place-finder');
