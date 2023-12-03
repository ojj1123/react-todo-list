import { useEffect, useReducer } from 'react'
import { TodoListEntity, todoListProvider } from '../api'

type TData = TodoListEntity[]
type TError = unknown

interface State {
  data?: TodoListEntity[]
  error?: TError
  isLoading: boolean
  isRefetching: boolean
}

type Action =
  | { type: 'fetching' }
  | { type: 'fetched'; payload: TData }
  | { type: 'error'; payload: TError }
  | { type: 'refetching' }
  | { type: 'refetched'; payload: TData }
  | { type: 'refetchError'; payload: TError }

const initialState: State = {
  data: undefined,
  error: undefined,
  isLoading: false,
  isRefetching: false,
}

const fetchReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'fetching': {
      return {
        ...state,
        isLoading: true,
      }
    }
    case 'fetched': {
      return {
        ...state,
        data: action.payload,
        error: undefined,
        isLoading: false,
      }
    }
    case 'error': {
      return {
        ...state,
        data: undefined,
        error: action.payload,
        isLoading: false,
      }
    }
    case 'refetching': {
      return {
        ...state,
        isRefetching: true,
      }
    }
    case 'refetched': {
      return {
        ...state,
        data: action.payload,
        error: undefined,
        isRefetching: false,
      }
    }
    case 'refetchError': {
      return {
        ...state,
        data: undefined,
        error: action.payload,
        isRefetching: false,
      }
    }
  }
}

export const useFetch = () => {
  const [state, dispatch] = useReducer(fetchReducer, initialState)

  useEffect(() => {
    let active = true

    const fetcher = async () => {
      dispatch({ type: 'fetching' })
      try {
        const data = await todoListProvider.getTodoList()
        if (active) {
          dispatch({ type: 'fetched', payload: data })
        }
      } catch (error) {
        if (active) {
          dispatch({ type: 'error', payload: error })
        }
      }
    }

    fetcher()
    return () => {
      active = false
    }
  }, [])

  const refetch = async () => {
    dispatch({ type: 'refetching' })

    try {
      const data = await todoListProvider.getTodoList()
      dispatch({ type: 'refetched', payload: data })
    } catch (error) {
      dispatch({ type: 'refetchError', payload: error })
    }
  }

  return { ...state, refetch } as const
}
