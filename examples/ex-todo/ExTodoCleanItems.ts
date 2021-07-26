import {CustomElementConstructor, ElementBuilder, OnBuilder, ContentBuilder} from '../../src'

const template = `
<form name="clean-items">
    <button type="submit">Clean done items</button>
</form>
`.trim()

export class ExTodoCleanItems extends HTMLElement {
}

export default ElementBuilder.get(ExTodoCleanItems).builder(
    ContentBuilder.get(template),
    OnBuilder.get('submit').prevent().invoke((el) => {
        el.dispatchEvent(new CustomEvent<string>('ex-todo-clean-items', {
            bubbles: true,
            cancelable: false
        }))
    })
).register() as CustomElementConstructor<ExTodoCleanItems>
