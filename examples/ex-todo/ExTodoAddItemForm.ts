import {CustomElementConstructor, ElementBuilder, OnBuilder, ContentBuilder} from '../../src'

const template = `
<form name="add-item">
    <input name="text" autocomplete="off" autofocus="" placeholder="type a thing to do" required="">
    <button type="submit">Add</button>
</form>
`.trim()

export class ExTodoAddItemForm extends HTMLElement {
}

export default ElementBuilder.get(ExTodoAddItemForm).builder(
    ContentBuilder.get(template),
    OnBuilder.get('submit').delegate('form').prevent().invoke((el, evt, form: HTMLFormElement) => {
        const text = (form.elements.namedItem('text') as HTMLInputElement).value
        el.dispatchEvent(new CustomEvent<string>("ex-todo-add-item", {
            bubbles: true,
            cancelable: false,
            detail: text
        }))
        form.reset()
    })
).register() as CustomElementConstructor<ExTodoAddItemForm>
