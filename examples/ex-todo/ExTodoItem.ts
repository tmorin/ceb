import {
    CustomElementConstructor,
    ElementBuilder,
    FieldBuilder,
    OnBuilder,
    ReferenceBuilder,
    TemplateBuilder
} from '../../src'

const template = `
<style>
:host {
  display: block
  contain: content
}
:host([done]) input[name=text] {
    text-decoration: line-through
}
</style>
<input type="checkbox" name="done">
<input type="text" name="text" required="">
`

export class ExTodoItem extends HTMLElement {
    done: boolean
    text: string = ''
    private readonly doneEl: HTMLInputElement
    private readonly textEl: HTMLInputElement

    render() {
        this.doneEl.checked = this.done
        this.textEl.value = this.text
        this.textEl.disabled = this.doneEl.checked
    }

    onInput() {
        this.done = this.doneEl.checked
        this.text = this.textEl.value
    }
}

export default ElementBuilder.get(ExTodoItem).builder(
    TemplateBuilder.get(template).shadow(true),

    FieldBuilder.get('done').listener((el: ExTodoItem) => el.render()).boolean(),
    ReferenceBuilder.get('doneEl').shadow().selector('input[name=done]'),

    FieldBuilder.get('text').listener((el: ExTodoItem) => el.render()),
    ReferenceBuilder.get('textEl').shadow().selector('input[name=text]'),

    OnBuilder.get('input,change').shadow().delegate('input').invoke((el: ExTodoItem) => el.onInput())
).register() as CustomElementConstructor<ExTodoItem>
