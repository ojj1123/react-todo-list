export function waitRandomSecond<T>(func: () => T): Promise<T> {
  const ms = Math.floor(Math.random() * 1000)
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = func()
      resolve(result)
    }, ms)
  })
}
