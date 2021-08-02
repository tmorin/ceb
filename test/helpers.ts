import process from 'process'
import {utilities} from '../src'

global.process = process

export function getTagName(constructor: Function) {
    return utilities.toKebabCase(constructor.name) as string
}
