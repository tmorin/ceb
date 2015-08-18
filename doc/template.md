# template()

The function `template()` return a fresh `TemplateBuilder` provided services to define ... a template.

## Import

```javascript
import {template} from 'custom-element-builder';
```

## Usage

The template can be given as a `string` or a `function`. The function will be called on `createdCallback`.

```javascript
import {ceb, template} from 'custom-element-builder';
ceb()
    .augment(
        template(`<button></button>`)
    )
    .register('ceb-example');
```

```javascript
import {ceb, template} from 'custom-element-builder';
ceb()
    .augment(
        template(el => `<button>${el.tagName}</button>`)
    )
    .register('ceb-example');
```
