import {Builder, property} from 'es6/lib/ceb.js';
import {toArray, isUndefined, isNull} from 'es6/lib/utils.js';

function getPropValue(booleanify, path, value) {
    return booleanify.indexOf(path) > -1 ? true : value;
}

function getAttrValue(booleanify, path, value) {
    return booleanify.indexOf(path) > -1 ? (value ? '' : undefined) : value;
}

export class AttributesAggregatorBuilder extends Builder {

    constructor(prefix) {
        super();
        this.data = {prefix, booleanify: []};
    }

    booleanify(...names) {
        this.data.booleanify = this.data.booleanify.concat(names);
        return this;
    }

    build(proto, on) {
        let prefix = this.data.prefix,
            booleanify = this.data.booleanify;

        property(prefix)
            .setter((el, value) => {
                // remove all prefixed attributes
                toArray(el.attributes)
                    .filter(attribute => attribute.name.indexOf(prefix) === 0)
                    .forEach(attribute => el.removeAttribute(attribute.name));
                // set prefixed attributes
                Object.keys(value || {})
                    .map(path => {
                        let name = `${prefix}-${path}`,
                            value = getAttrValue(booleanify, path, value[path]);
                        return {name, value};
                    })
                    .filter(attribute => !isUndefined(attribute.value) && !isNull(attribute.value))
                    .forEach(attribute => el.setAttribute(attribute.name, attribute.value));
            })
            .getter(el => {
                return toArray(el.attributes)
                    .filter(attribute => attribute.name.indexOf(prefix) === 0)
                    .map(attribute => {
                        let path = attribute.name.replace(prefix + '-', ''),
                            value = getPropValue(booleanify, path, attribute.value);
                        return {path, value};
                    }).reduce((a, b) => {
                        a[b.path] = b.value;
                        return a;
                    }, {});
            })
            .build(proto, on);

    }
}

export function attributesAggregator(prefix) {
    return new AttributesAggregatorBuilder(prefix);
}

