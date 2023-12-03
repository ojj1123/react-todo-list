import { useCallback, useMemo, useState } from 'react'

export const useLoading = () => {
  const [loading, setLoading] = useState(false)

  const startTransition = useCallback(
    async <T>(promise: Promise<T> | (() => Promise<T>)) => {
      try {
        setLoading(true)
        const data =
          typeof promise === 'function' ? await promise() : await promise
        return data
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return useMemo(
    () => [loading, startTransition] as const,
    [loading, startTransition]
  )
}
