import {ceb, property, method, on} from 'es6/lib/ceb.js';
import {idomify} from './idomify.js';

ceb().augment(
    idomify(`
        <form class="add">
            <input required placeholder="an item" name="content">
            <input type="submit">
        </form>
        <ul>
        <% data.items.forEach(function(item, index) { %>
            <li>
                <button class="remove" data-index="<%= index %>">X</button> <%= item %>
            </li>
        <%  }); %>
        </ul>
    `),

    property('items').immutable().value([]),

    method('addItem').invoke((el, item) => {
        el.items.push(item);
        el.render();
    }),

    method('removeItem').invoke((el, item) => {
        var index = el.items.indexOf(item);
        el.items.splice(index, 1);
        el.render();
    }),

    on('submit').delegate('form.add').skip().invoke((el, evt) => {
        el.addItem(evt.target.content.value);
    }),

    on('click').delegate('button.remove').skip().invoke((el, evt) => {
        el.removeItem(el.items[parseInt(evt.target.getAttribute('data-index'))]);
    })
).register('ceb-list');
