export function waitHalfSecond<T>(func: () => T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = func() as ReturnType<typeof func>
      resolve(result)
    }, 500)
  })
}
