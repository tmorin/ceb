import {isUndefined, toArray} from 'lodash/lang';

export default class CustomElementBuilder {

    constructor() {
        this.struct = {
            proto: Object.create(HTMLElement.prototype),
            builders: []
        };
    }

    extends(value) {
        this.struct.extends = value;
    }

    proto(value) {
        this.struct.proto = value;
    }

    augment() {
        toArray(arguments).forEach(builder => this.struct.builders.push(builder));
    }

    register(name) {
        var on = () => {
        };

        this.struct.builders.forEach(builder => builder.build(this.struct.proto, on));

        var CustomElement = document.registerElement(name, {
            prototype: this.struct.proto,
            extends: this.struct.extends
        });


    }
}
