import { toKebabCase } from "@tmorin/ceb-utilities"

/**
 * The constructor of a Custom Element
 */
export interface HTMLElementConstructor<E extends HTMLElement = HTMLElement> {
  new (...args: any[]): E
}

/**
 * Get the tag name from the constructor of an HTML element.
 * @param constructor
 */
export function getTagName(constructor: HTMLElementConstructor) {
  return toKebabCase(constructor.name)
}

/**
 * The done callback.
 */
export interface DoneCallback<T = unknown> {
  (...args: Array<T>): T
}

/**
 * listen to events.
 * @param el the event dispatcher
 * @param type the type of the event
 * @param limit the number of event to listen to
 * @param done the callback to call once done
 */
export function listen(el: EventTarget, type: string, limit: number, done: DoneCallback) {
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
