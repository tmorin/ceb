import {assert} from 'chai'
import {DefaultRegistry, Registry} from "./registry";

describe('inversion/registry', function () {

    let registry: Registry;
    beforeEach(function () {
        registry = new DefaultRegistry();
    })

    it('should replies if contained', function () {
        registry = new DefaultRegistry(new Map());
        assert.notOk(registry.contains('value'));
    });

    it('should register values', function () {
        registry.registerValue('value', 'the value #0');
        registry.registerValue('value', 'the value #1');
        registry.registerValue('value', 'the value #2');
        assert.strictEqual(registry.resolve('value'), 'the value #2');
        const values = registry.resolveAll<string>('value');
        assert.deepEqual(values, ['the value #2', 'the value #1', 'the value #0']);
    });

    it('should failed when not resolve values', function () {
        assert.throw(() => registry.resolve('value'), /unable to resolve an entry with the key \(value\)/);
        assert.throw(() => registry.resolveAll('value'), /unable to resolve an entry with the key \(value\)/);
    });

    it('should register factory', function () {
        let cnt = 0;
        registry.registerFactory('factory', () => (cnt++));
        registry.registerFactory('factory', () => (cnt++));
        assert.strictEqual(registry.resolve('factory'), 0);
        assert.strictEqual(registry.resolve('factory'), 1);
        assert.strictEqual(registry.resolve('factory'), 2);
    });

    it('should register factory as singleton', function () {
        let cnt = 0;
        registry.registerFactory('factory', () => (cnt++), {singleton: true});
        assert.strictEqual(registry.resolve('factory'), 0);
        assert.strictEqual(registry.resolve('factory'), 0);
        assert.strictEqual(registry.resolve('factory'), 0);
    });

})
