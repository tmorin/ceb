import process from 'process'
import {toKebabCase} from "../src/utilities";

global.process = process

export function getTagName(constructor: Function) {
    return toKebabCase(constructor.name) as string
}
