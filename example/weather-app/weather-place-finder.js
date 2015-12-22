import {
    element,
    method,
    template,
    on,
    dispatchCustomEvent
} from 'ceb';

export const WeatherPlaceFinder = element().builders(
    template(`
        <weather-api></weather-api>
        <form novalidate name="placeFinderForm" class="form-inline">
            <input type="text"
                class="form-control"
                name="query"
                placeholder="London, Delhi, paris, ..."
                autocomplete="off">
            <button type="submit" class="btn btn-default">search</button>
        </form>
        <ul></ul>
    `),

    on('submit').delegate('form').invoke((el, evt) => {
        evt.preventDefault();
        let query = evt.target.query.value;
        if (query.length > 2) {
            let ul = el.querySelector('ul');
            ul.innerHTML = 'searching ...';
            el.querySelector('weather-api').find(query).then(data => {
                ul.innerHTML = '';

                let frag = document.createDocumentFragment();
                data.list.filter(result => result.id > 0).map(result => {
                    let a = document.createElement('a');
                    a.textContent = `${result.name} (${result.sys.country})`;
                    a.setAttribute('data-locationId', result.id);
                    a.href = '#';
                    let li = document.createElement('li');
                    li.appendChild(a);
                    return li;
                }).forEach(li => frag.appendChild(li));

                if (frag.childNodes.length < 1) {
                    let li = document.createElement('li');
                    li.textContent = 'No result';
                    frag.appendChild(li);
                }

                ul.appendChild(frag);
            }, xhr => {
                if (xhr) {
                    ul.innerHTML = '<li>Unable find locations.</li>';
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
        el.querySelector('ul').innerHTML = '';
    })
).register('weather-place-finder');
