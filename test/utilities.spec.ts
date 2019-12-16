import {toCamelCase, toKebabCase} from '../src/utilities';
import * as assert from 'assert';

describe('utilities', () => {
    let sandbox;

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'));
    });

    it('should convert to camel case', () => {
        assert.strictEqual(toCamelCase('to-camel-case'), 'toCamelCase');
    });

    it('should convert to kebab case', () => {
        assert.strictEqual(toKebabCase('ToCamelCase'), 'to-camel-case');
    });

    it('should handle empty string', () => {
        assert.strictEqual(toCamelCase(''), '');
        assert.strictEqual(toKebabCase(''), '');
    });

});
