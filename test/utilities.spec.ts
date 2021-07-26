import {utilities} from '../src'
import {assert} from 'chai'

describe('utilities', () => {
    it('should convert to camel case', () => {
        assert.strictEqual(utilities.toCamelCase('to-camel-case'), 'toCamelCase')
    })
    it('should convert to kebab case', () => {
        assert.strictEqual(utilities.toKebabCase('ToCamelCase'), 'to-camel-case')
    })
    it('should handle empty string', () => {
        assert.strictEqual(utilities.toCamelCase(''), '')
        assert.strictEqual(utilities.toKebabCase(''), '')
    })
})
