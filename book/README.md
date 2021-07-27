# &lt;ceb/&gt; ~ Custom Element Builder

`<ceb/>` is a library helping to develop [Custom Elements (v1)].
Its core is a builder which executes others builders.
By this way, `<ceb/>` is natively opened to extensions and builders easily sharable.

`<ceb/>` is released under the [MIT license].

The source code is available on GitHub: [github.com/tmorin/ceb].

---

A simple Custom Element displaying a greeting text:

```typescript
import {ElementBuilder, FieldBuilder, TemplateBuilder} from "ceb"

// Define the Custom Element
@ElementBuilder.element<ExGreeting>()
export class ExGreeting extends HTMLElement {
  // Bind the property `name` to the attribute `name`
  @FieldBuilder.field()
  name = "World"

  // Define the template of the custom element
  @TemplateBuilder.template()
  private render() {
    return html`<p>Hello, ${this.name}!</p>`
  }
  
  // Render the template when the name change
  @FieldBuilder.listen()
  private onName() {
    this.render()
  }
}
```

```html
<ex-greeting name="John Doe" />
```

[Custom Elements (v1)]: https://html.spec.whatwg.org/multipage/custom-elements.html
[MIT license]: http://opensource.org/licenses/MIT
[github.com/tmorin/ceb]: https://github.com/tmorin/ceb
