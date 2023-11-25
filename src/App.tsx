import { useEffect, useState } from 'react'
import './App.css'
import { Editable, Loading, TodoListForm } from './components'
import { TodoListEntity, todoListProvider } from './api'

function App() {
  const [todoList, setTodoList] = useState<TodoListEntity[]>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    todoListProvider.getTodoList().then((data) => {
      setLoading(false)
      setTodoList(data)
    })
  }, [])
  /**
   * TODO
   * - 로딩인디케이터
   * - 추가, 수정, 삭제 비동기 로직 작성
   */

  return (
    <>
      <h1>오늘 할 일</h1>
      <section>
        {loading ? (
          <Loading />
        ) : (
          <ul>
            {todoList
              ?.filter((todo) => !todo.isArchived)
              .map((todo) => {
                return (
                  <li key={todo.id}>
                    <Editable.Root>
                      <Editable.Input type="text" />
                      <Editable.Preview>
                        <input type="checkbox" checked={todo.isComplete} />
                        <Editable.EditTrigger>
                          <span>{todo.description}</span>
                        </Editable.EditTrigger>
                      </Editable.Preview>
                      <Editable.Control>
                        {(props) => (
                          <>
                            {props.isEditing ? (
                              <>
                                <Editable.Cancel>취소</Editable.Cancel>
                                <Editable.Submit>삭제</Editable.Submit>
                                <Editable.Submit>저장</Editable.Submit>
                              </>
                            ) : null}
                          </>
                        )}
                      </Editable.Control>
                    </Editable.Root>
                  </li>
                )
              })}

            <TodoListForm />
          </ul>
        )}
      </section>

      <h1>아카이브</h1>
      <section>
        <ul>
          {loading ? (
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

export default App
