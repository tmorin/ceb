import {ceb, property, method, on} from '../../es6/lib/ceb.js';
import {handlebarify} from '../builders/handlebarify.js';

ceb().builders(
    handlebarify(`
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
        {{#each items}}
            <p>
                <button class="remove btn btn-default btn-xs" data-index="{{@index}}">
                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </button>
                {{this}}
            </p>
        {{/each}}
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
