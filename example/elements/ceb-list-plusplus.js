import {ceb, property, method, on} from 'es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';

ceb().augment(
    idomify(`
        <form class="add">
            <input required placeholder="an item" name="content">
            <input type="submit">
        </form>
        <ul>
        <% data.items.forEach(function(item, index) { />
            <li class="row {{ index % 2 == 1 ? ' even' : '' }}">
                <button class="remove" data-index="{{ index }}">X</button>
                <%= item />
            </li>
        <%  }); />
        </ul>
    `),

    property('items').immutable().value([]),

    method('addItem').invoke((el, item) => {
        el.items.push(item);
        el.render();
        el.querySelector('[name=content]').value = '';
        el.querySelector('[name=content]').focus();
    }),

    method('removeItem').invoke((el, item) => {
        var index = el.items.indexOf(item);
        el.items.splice(index, 1);
        el.render();
        el.querySelector('[name=content]').focus();
    }),

    on('submit').delegate('form.add').skip().invoke((el, evt) => {
        el.addItem(evt.target.content.value);
    }),

    on('click').delegate('button.remove').skip().invoke((el, evt) => {
        el.removeItem(el.items[parseInt(evt.target.getAttribute('data-index'))]);
    })
).register('ceb-list-plusplus');
