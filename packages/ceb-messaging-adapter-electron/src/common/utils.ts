export function toError(error: any): Error {
  if (error instanceof Error) {
    return error
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const message: string = error ? error?.toString() : "an error occured"
  return new Error(message)
}
