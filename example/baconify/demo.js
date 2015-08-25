import {ceb, template, on} from 'es6/lib/ceb.js';
import {baconify} from './baconify.js';

ceb().augment(
    template(`
        <input class="search">
        <ul></ul>
    `),
    baconify(on('keydown').stop().delegate('input.search')).apply((el, stream) => {
        return stream
            .debounce(300)
            .map(evt => evt.target.value)
            .skipDuplicates()
            .onValue(value => {
                let li = document.createElement('li');
                li.textContent = value;
                el.querySelector('ul').appendChild(li);
            });
    })
).register('ceb-input');
