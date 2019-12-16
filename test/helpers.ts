import {toKebabCase} from '../src/utilities';

export function getTagName(constructor: Function) {
    return toKebabCase(constructor.name);
}
