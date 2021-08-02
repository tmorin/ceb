import {ContentBuilder, CustomElementConstructor, ElementBuilder, OnBuilder, ReferenceBuilder} from '../../src'
import './ExTodoAddItemForm'
import './ExTodoCleanItems'
import './ExTodoItemList'
import {ExTodoItemList} from './ExTodoItemList'

const template = `
<ex-todo-add-item-form></ex-todo-add-item-form>
<hr>
<ex-todo-item-list></ex-todo-item-list>
<hr>
<ex-todo-clean-items></ex-todo-clean-items>
`

export class ExTodoApp extends HTMLElement {
    private itemList?: ExTodoItemList

    onAddItem(text: string) {
        this.itemList?.addItem(text)
    }

    onCleanItems() {
        this.itemList?.cleanItems()
    }
}

export default ElementBuilder.get(ExTodoApp).builder(
    ContentBuilder.get(template),
    ReferenceBuilder.get('itemList').selector('ex-todo-item-list'),
    OnBuilder.get<ExTodoApp>('ex-todo-add-item').invoke((el, evt: CustomEvent<string>) => el.onAddItem(evt.detail)),
    OnBuilder.get<ExTodoApp>('ex-todo-clean-items').invoke((el) => el.onCleanItems())
).register() as CustomElementConstructor<ExTodoApp>
