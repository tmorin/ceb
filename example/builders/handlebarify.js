import {template, method, applyTemplate} from '../../src/ceb.js';
import handlebars from 'handlebars/dist/handlebars.js';

export class HandlebarsBuilder {

    constructor(tpl) {
        this.data = {tpl};
    }

    build(proto, on) {
        var tpl = handlebars.compile(this.data.tpl);
        template(tpl).build(proto, on);
        method('render').invoke(el => {
            applyTemplate(el, tpl(el));
        }).build(proto, on);
    }

}

export function handlebarify(tpl) {
    return new HandlebarsBuilder(tpl);
}
