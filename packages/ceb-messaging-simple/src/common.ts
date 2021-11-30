export function waitForReturn<O>(fn: (...args: Array<any>) => Promise<O>, timeout: number): Promise<O> {
  return new Promise<O>((resolve, reject) => {
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
