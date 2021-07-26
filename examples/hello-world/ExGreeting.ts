import {ElementBuilder, FieldBuilder, FieldListenerData, ReferenceBuilder, ContentBuilder} from '../../src'

@ElementBuilder.element<ExGreeting>()
@ContentBuilder.content({
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
