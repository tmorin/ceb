# &lt;ceb/&gt; ~ Custom Element Builder

`<ceb/>` is a library helping to develop [Custom Elements (v1)].
Its core is a builder which executes others builders.
By this way, `<ceb/>` is natively opened to extensions and builders easily sharable.

`<ceb/>` is released under the [MIT license].

The source code is available on GitHub: [github.com/tmorin/ceb].

---

A simple Custom Element displaying a greeting text:

```typescript
import {
    ElementBuilder, 
  FieldBuilder, 
  FieldListenerData, 
  ReferenceBuilder, 
  TemplateBuilder
} from "ceb";

@ElementBuilder.element<ExGreeting>()
@TemplateBuilder.template({
  content: "<p>Hello, <span id='name'></span>!</p>",
  isShadow: true
})
export class ExGreeting extends HTMLElement {
  @ReferenceBuilder.reference({
    selector: "span#name",
    isShadow: true
  })
  span: HTMLSpanElement

  @FieldBuilder.field()
  name: string = "World"

  @FieldBuilder.listen()
  private onName(data: FieldListenerData) {
    this.span.textContent = data.newVal
  }
}
```

```html
<ex-greeting name="World" />
```

[Custom Elements (v1)]: https://html.spec.whatwg.org/multipage/custom-elements.html
[MIT license]: http://opensource.org/licenses/MIT
[github.com/tmorin/ceb]: https://github.com/tmorin/ceb
