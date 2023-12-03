import { useEffect, useState } from 'react'
import { TodoListEntity, todoListProvider } from '../api'

type TError = unknown
type TData = TodoListEntity[] | null

export const useFetch = () => {
  /**
   * TODO
   * - useState -> useReducer
   */
  const [data, setData] = useState<TData>(null)
  const [error, setError] = useState<TError>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefetch, setIsRefetch] = useState(false)

  useEffect(() => {
    let active = true

    setIsLoading(true)

    todoListProvider
      .getTodoList()
      .then((data) => {
        if (active) {
          setData(data)
          setError(null)
        }
      })
      .catch((error) => {
        if (active) {
          setData(null)
          setError(error)
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const refetch = async () => {
    setIsRefetch(true)

    try {
      const data = await todoListProvider.getTodoList()
      setData(data)
      setError(null)
    } catch (error) {
      setData(null)
      setError(error)
    } finally {
      setIsRefetch(false)
    }
  }

  return { data, error, isLoading, isRefetch, refetch } as const
}
