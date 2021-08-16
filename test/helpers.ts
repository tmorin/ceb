import process from 'process'
import {toKebabCase} from "../src/utilities";

global.process = process

export function getTagName(constructor: Function) {
    return toKebabCase(constructor.name) as string
}

export function listen(el: GlobalEventHandlers | EventTarget, type: string, limit: number, done: Function) {
    let counter = 0
    const listener = () => {
        counter++
        if (counter === limit) {
            done()
            el.removeEventListener(type, listener)
        }
    }
    el.addEventListener(type, listener)
}
