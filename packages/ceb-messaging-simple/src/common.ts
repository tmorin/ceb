/**
 * The method wraps a promise fulfillment in order to _cancel_ its resolution when a timeout is reached.
 * @param fn the provide of the promise
 * @param timeout the maximum time to wait for in millisecond
 */
export function waitForReturn<R>(fn: (...args: Array<any>) => Promise<R>, timeout: number): Promise<R> {
  return new Promise<R>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`unable to get the result on time`))
    }, timeout)
    Promise.resolve((async () => fn())())
      .then((output) => {
        clearTimeout(timeoutId)
        resolve(output)
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        reject(error)
      })
  })
}
