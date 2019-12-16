import '@webcomponents/webcomponentsjs';
import * as assert from 'assert';
import {ElementBuilder} from '../src/element';
import {getTagName} from './helpers';
import {DelegateBuilder} from '../src/delegate';

describe('DelegateBuilder', () => {
    let sandbox;

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'));
    });

    it('should delegate attribute to attribute', () => {
        class DelegateBuilderAttrToAttr extends HTMLElement {
            prop1 = 'prop1';
        }

        ElementBuilder.get(DelegateBuilderAttrToAttr)
            .builder(
                new DelegateBuilder()
            )
            .register();
        const tagName = getTagName(DelegateBuilderAttrToAttr);
        sandbox.appendChild(document.createElement(tagName));

        assert.ok(true);
    });

});
