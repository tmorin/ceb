import {CustomElementConstructor, ElementBuilder, FieldBuilder, ReferenceBuilder} from '../src/ceb';
import {TemplateBuilder} from '../src/template';

const template = `
<label id="label"></label>
<div id="controls"><slot></slot></div>
<div id="helper"></div>
`.trim();

export class ExFormField extends HTMLElement {
    label: string;
    helper: string;
    private readonly labelElement: HTMLElement;
    private readonly helperElement: HTMLElement;

    render() {
        this.labelElement.textContent = this.label;
        this.helperElement.textContent = this.helper;
    }
}

export default ElementBuilder.get(ExFormField).builder(
    FieldBuilder.get('label').listener((el: ExFormField) => el.render()),
    ReferenceBuilder.get('labelElement').shadow().selector('#label'),

    FieldBuilder.get('helper').listener((el: ExFormField) => el.render()),
    ReferenceBuilder.get('helperElement').shadow().selector('#helper'),

    TemplateBuilder.get(template).shadow()
).register() as CustomElementConstructor<ExFormField>;
