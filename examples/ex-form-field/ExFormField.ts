import {
    AttributePropagationBuilder,
    ContentBuilder,
    ElementBuilder,
    FieldBuilder,
    OnBuilder,
    ReferenceBuilder
} from '../../src'

// An hard coded list of selector helping to select only focusable elements.
const focusableElementSelector = `a[href]:not([tabindex='-1']),
area[href]:not([tabindex='-1']),
input:not([disabled]):not([tabindex='-1']),
select:not([disabled]):not([tabindex='-1']),
textarea:not([disabled]):not([tabindex='-1']),
button:not([disabled]):not([tabindex='-1']),
iframe:not([tabindex='-1']),
[tabindex]:not([tabindex='-1']),
[contentEditable=true]:not([tabindex='-1'])`

// Register the class ExFormField as a regular Custom Element.
@ElementBuilder.get<ExFormField>().decorate()
// Define the content of the shadow DOM of the Custom Element at its creation.
// The content expects to host a light DOM of FORM controls enclosed within a default `slot` element.
@ContentBuilder.get(`
<style>
:host {
    display: block
    padding: 0.5em 0
}
:host #helper {
    font-size: smaller
}
:host([hidden]) {
    display: none
}
</style>
<label id="label"></label>
<div id="controls"><slot></slot></div>
<div id="helper"></div>
`.trim()).shadow().decorate()
// The Custom Element define a field `label` which is bound to an enclosed `label#label` element.
@AttributePropagationBuilder.get("label").to('#label').shadow().property("textContent").decorate()
// The Custom Element define a field `helper` which is bound to an enclosed `div#helper` element.
@AttributePropagationBuilder.get("helper").to('#helper').shadow().property("textContent").decorate()
export class ExFormField extends HTMLElement {
    // This field is an API to mutated the enclosed `label#label` element.
    @FieldBuilder.get().decorate()
    label: string

    // This field is an API to mutated the enclosed `div#helper` element.
    @FieldBuilder.get().decorate()
    helper: string

    // This property is reference to the light DOM accessible from the Shadow DOM.
    @ReferenceBuilder.get().shadow().selector( '#controls slot').decorate()
    readonly slotElement: HTMLSlotElement

    // The listener reacts on clicks on the `label#label` to delegate focus on the first focusable control.
    @OnBuilder.get('click #label').shadow().decorate()
    on() {
        for (const element of Array.from<Element>(this.querySelectorAll(focusableElementSelector))) {
            if (element instanceof HTMLElement) {
                element.focus()
            }
        }
    }
}