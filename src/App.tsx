import { useRef, useState } from 'react'
import './App.css'
import { Loading, TodoItem } from './components'
import { todoListProvider } from './api'
import { useFetch, useLoading } from './hooks'
import { Link, Route, Router } from './components/router'

function App() {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/mypage" component={MyPage} />
      <Route path="/about" component={About} />
    </Router>
  )
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
      <Link to="/mypage">My page</Link>
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

function MyPage() {
  return (
    <>
      <h1>My Page</h1>
      <Link to="/about">about</Link>
    </>
  )
}

function About() {
  return (
    <>
      <h1>About page</h1>
      <Link to="/">home</Link>
    </>
  )
}

export default App
