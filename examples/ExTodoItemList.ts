import {CustomElementConstructor, ElementBuilder, ReferenceBuilder} from '../src/ceb';
import './ExTodoItem';
import {ExTodoItem} from './ExTodoItem';

export class ExTodoItemList extends HTMLElement {
    private readonly todoItems: Array<ExTodoItem>;

    addItem(text: string) {
        const exTodoItem = this.appendChild(document.createElement('ex-todo-item')) as ExTodoItem;
        exTodoItem.text = text;
    }

    cleanItems() {
        this.todoItems.filter(item => item.done).forEach(item => item.parentNode.removeChild(item));
    }
}

export default ElementBuilder.get(ExTodoItemList).builder(
    ReferenceBuilder.get('todoItems').selector('ex-todo-item').array()
).register() as CustomElementConstructor<ExTodoItemList>;
