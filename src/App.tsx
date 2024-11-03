import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import './App.css'
import { Loading, TodoItem } from './components'
import { todoListProvider } from './api'
import { useFetch, useLoading } from './hooks'

const About = () => {
  return <>about</>
}
const Mypage = () => {
  return <>Mypage</>
}

const Home = () => {
  const { data: todoList, isLoading: isTodoListloading, refetch } = useFetch()

  const [isCreating, setIsCreating] = useState(false)
  const createInputRef = useRef<HTMLInputElement>(null)

  const [isCreatingloading, startTransition] = useLoading()

  const createTodo = async () => {
    if (!createInputRef.current || !createInputRef.current.value) return

    await startTransition(async () => {
      await todoListProvider.createTodo({
        description: createInputRef.current?.value as string,
      })
      await refetch()
    })
  }
  return (
    <>
      <h1>오늘 할 일</h1>
      <section>
        {isTodoListloading ? (
          <Loading />
        ) : (
          <>
            <ul>
              {todoList
                ?.filter((todo) => !todo.isArchived)
                .map((todo) => {
                  return (
                    <TodoItem key={todo.id} todo={todo} onRefetch={refetch} />
                  )
                })}

              {isCreatingloading ? (
                <Loading />
              ) : (
                <>
                  {isCreating ? (
                    <li>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          createTodo()
                          setIsCreating(false)
                        }}
                      >
                        <input type="text" ref={createInputRef} autoFocus />
                        <button
                          type="button"
                          onClick={() => setIsCreating(false)}
                        >
                          취소
                        </button>
                        <button type="submit">추가</button>
                      </form>
                    </li>
                  ) : (
                    <button type="button" onClick={() => setIsCreating(true)}>
                      오늘의 할일 추가하기
                    </button>
                  )}
                </>
              )}
            </ul>
          </>
        )}
      </section>

      <h1>아카이브</h1>
      <section>
        <ul>
          {isTodoListloading ? (
            <Loading />
          ) : (
            <>
              {todoList
                ?.filter((todo) => todo.isArchived)
                .map((todo) => {
                  return (
                    <li key={todo.id}>
                      <span>{todo.description}</span>
                    </li>
                  )
                })}
            </>
          )}
        </ul>
      </section>
    </>
  )
}
const routes = [
  { path: '/', component: <Home /> },
  { path: '/about', component: <About /> },
  { path: '/mypage', component: <Mypage /> },
]

function App() {
  const [path, setPath] = useState('/')

  useLayoutEffect(() => {
    setPath(window.location.pathname)
  }, [])

  useEffect(() => {
    const handler = () => {
      console.log('popstate', window.location.pathname)
      setPath(window.location.pathname)
    }

    // NOTE: popstate 이벤트: 뒤로가기/앞으로가기 할 때 발생하는 이벤트
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  const navigate = useCallback(
    (url: string, replace: boolean = false) => {
      if (path === url) return

      if (replace) {
        window.history.replaceState(null, null, url)
      } else {
        window.history.pushState(null, null, url)
      }
      setPath(url)
    },
    [path]
  )

  return (
    <>
      <button type="button" onClick={() => navigate('/')}>
        home
      </button>
      <button type="button" onClick={() => navigate('/about')}>
        about
      </button>
      <button type="button" onClick={() => navigate('/mypage', true)}>
        mypage
      </button>

      {routes.find((route) => route.path === path)?.component || <>NOT FOUND</>}
    </>
  )
}

// 현재 path
// 버튼 누르면 routes.component 렌더링

export default App
