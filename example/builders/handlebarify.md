{% include "/doc/_urls.md" %}
# handlebarify

It's goal is to provide an easy way to play with the [handlebarsjs] templating engine.

This builder is used by the [List](../list/README.md) example.

The following snippet is extracted from the [List](../list/README.md) example.

```javascript
import {element, on} from 'ceb';
import {handlebarify} from 'handlebarify';

let cebExampleBuilder = element().base(Object.create(HTMLButtonElement.prototype), 'button');

cebExampleBuilder.builders(
    property('items').immutable().value([]),

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
    `)
);

export default cebExampleBuilder.register('ceb-example');
```

The context of the template is the custom element instance.
