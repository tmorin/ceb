import {
    AttributeDelegateBuilder,
    ElementBuilder,
    FieldBuilder,
    OnBuilder,
    ReferenceBuilder,
    TemplateBuilder
} from '../src/ceb';
import {toArray} from "../src/utilities";

const focusableElementSelector = `a[href]:not([tabindex='-1']),
area[href]:not([tabindex='-1']),
input:not([disabled]):not([tabindex='-1']),
select:not([disabled]):not([tabindex='-1']),
textarea:not([disabled]):not([tabindex='-1']),
button:not([disabled]):not([tabindex='-1']),
iframe:not([tabindex='-1']),
[tabindex]:not([tabindex='-1']),
[contentEditable=true]:not([tabindex='-1'])`;

@ElementBuilder.element<ExFormField>()
@TemplateBuilder.template({
    content: `
<style>
:host {
    display: block;
    padding: 0.5em 0;
}
:host #helper {
    font-size: smaller;
}
:host([hidden]) {
    display: none
}
</style>
<label id="label"></label>
<div id="controls"><slot></slot></div>
<div id="helper"></div>
`.trim(), isShadow: true
})
@AttributeDelegateBuilder.delegate('label', '#label', {isShadow: true, toPropName: 'textContent'})
@AttributeDelegateBuilder.delegate('helper', '#helper', {isShadow: true, toPropName: 'textContent'})
export class ExFormField extends HTMLElement {
    @FieldBuilder.field()
    readonly label: string;

    @ReferenceBuilder.reference({isShadow: true, selector: '#controls slot'})
    readonly slotElement: HTMLSlotElement;

    @OnBuilder.listen('click #label', {isShadow: true})
    on() {
        for (const element of toArray<Element>(this.querySelectorAll(focusableElementSelector))) {
            if (element instanceof HTMLElement) {
                element.focus();
            }
        }
    }
}
