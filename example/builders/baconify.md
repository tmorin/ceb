{% include "/doc/_urls.md" %}
# baconify

It's goal is to provide an easy way to play [baconjs] streams.
The streams are created from the builders `attribute` and `on`.

This builder is used by the [Address selector](../address-selector/README.md) example.

The following snippet is extracted from the [Address selector](../address-selector/README.md) example.

```javascript
import {element, on} from 'ceb';
import {baconify} from 'baconify';

let cebExampleBuilder = element().base(Object.create(HTMLButtonElement.prototype), 'button');

cebExampleBuilder.builders(
    /* When the input get new input, suggestions should be fetched */
    baconify(on('input').delegate('input[type=text]'))
        .apply((el, stream) => {
            let query = stream.debounce(300).map(evt => evt.target.value);
            let suggestions = query.flatMapLatest(getPlaces);
            query.awaiting(suggestions)
                .filter(value => value).onValue(() => el._suggestionsContainer.innerHTML = 'Searching ...');
            return suggestions;
        })
        .trigger('suggestions')
);

export default cebExampleBuilder.register('ceb-example');
```

`baconify(on('input').delegate('input[type=text]'))` will create a stream based on the delegated event
when the custom element is attached.
The stream will be killed when the custom element is detached.

The method `apply()` can be used to write the logic of the stream.

The method `trigger()` will dispatch a custom event according to the stream logic of the `apply()` method.
