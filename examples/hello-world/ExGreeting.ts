import {ContentBuilder, ElementBuilder, FieldBuilder, FieldListenerData, ReferenceBuilder} from '../../src'

@ElementBuilder.get<ExGreeting>().decorate()
@ContentBuilder.get(`<p>Hello, <span id="name"></span>!</p>`).shadow().decorate()
export class ExGreeting extends HTMLElement {
    @ReferenceBuilder.get().shadow().selector("span#name").decorate()
    span?: HTMLSpanElement

    @FieldBuilder.get().decorate()
    name: string = "World"

    @FieldBuilder.get().decorate()
    private onName(data: FieldListenerData) {
        if (this.span) {
            this.span.textContent = data.newVal
        }
    }
}
