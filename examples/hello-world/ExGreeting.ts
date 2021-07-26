import {ElementBuilder, FieldBuilder, FieldListenerData, ReferenceBuilder, TemplateBuilder} from '../../src/ceb'

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
