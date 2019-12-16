import {CustomElementConstructor, ElementBuilder, OnBuilder, ReferenceBuilder, TemplateBuilder} from '../src/ceb';
import './ExTodoAddItemForm';
import './ExTodoCleanItems';
import './ExTodoItemList';
import {ExTodoItemList} from './ExTodoItemList';

const template = `
<ex-todo-add-item-form></ex-todo-add-item-form>
<hr>
<ex-todo-item-list></ex-todo-item-list>
<hr>
<ex-todo-clean-items></ex-todo-clean-items>
`;

export class ExTodoApp extends HTMLElement {
    private readonly itemList: ExTodoItemList;

    onAddItem(text: string) {
        this.itemList.addItem(text);
    }

    onCleanItems() {
        this.itemList.cleanItems();
    }
}

export default ElementBuilder.get(ExTodoApp).builder(
    TemplateBuilder.get(template),
    ReferenceBuilder.get('itemList').selector('ex-todo-item-list'),
    OnBuilder.get('ex-todo-add-item').invoke((el: ExTodoApp, evt: CustomEvent<string>) => el.onAddItem(evt.detail)),
    OnBuilder.get('ex-todo-clean-items').invoke((el: ExTodoApp) => el.onCleanItems())
).register() as CustomElementConstructor<ExTodoApp>;
