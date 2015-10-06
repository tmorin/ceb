import {ceb, property, method, on} from 'es6/lib/ceb.js';
import {idomify} from '../builders/idomify.js';

ceb().augment(
    idomify(`
        <form class="add">
            <div class="input-group">
                <input required placeholder="an item" name="content" class="form-control">
                <span class="input-group-btn">
                    <button type="submit" class="btn btn-default">
                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                   </button>
                </span>
            </div>
        </form>
        <br>
        <tpl-each items="data.items" item="item" index="index">
            <p tpl-key="index" class="{{ index % 2 == 1 ? ' even' : '' }}">
                <button class="remove btn btn-default btn-xs" data-index="{{ index }}">
                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </button>
                <tpl-text value="item" />
            </p>
        </tpl-each>
    `),

    property('items').immutable().value([]),

    method('createdCallback').invoke(el => {
        el.render();
    }),

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
