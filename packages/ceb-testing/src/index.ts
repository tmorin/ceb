import {toKebabCase} from "@tmorin/ceb-utilities";

export function getTagName(constructor: Function) {
    return toKebabCase(constructor.name) as string
}

export function listen(el: EventTarget, type: string, limit: number, done: Function) {
    let counter = 0
    const listener = () => {
        counter++
        if (counter === limit) {
            el.removeEventListener(type, listener)
            done()
        }
    }
    el.addEventListener(type, listener)
}
