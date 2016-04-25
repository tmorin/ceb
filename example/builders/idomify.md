{% include "/doc/_urls.md" %}
# idomify

It's goal is to provide an easy way to play with the [incremental-dom] templating engine.

This builder is used by the following examples:

- [List++](../list-plusplus/README.md)
- [Grid](../grid/README.md)

The following snippet is extracted from the [List++](../list-plusplus/README.md) example.
{% raw %}
```javascript
import {element, on} from 'ceb';
import {idomify} from 'idomify';

let cebExampleBuilder = element().base(Object.create(HTMLButtonElement.prototype), 'button');

cebExampleBuilder.builders(
    property('items').immutable().value([]),

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
    `)
);

export default cebExampleBuilder.register('ceb-example');
```
{% endraw %}
The context of the template is the custom element instance.
