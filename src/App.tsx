import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Editable, Loading } from './components'
import { TodoListEntity, TodoListUpdateRequest, todoListProvider } from './api'

function App() {
  const [todoList, setTodoList] = useState<TodoListEntity[]>()
  const [isTodoListloading, setisTodoListLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isCreatingloading, setIsCreatingLoading] = useState(false)
  const createInputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [isEditLoading, setIsEditLoading] = useState(false)
  const [isCompleteLoading, setIsCompleteLoading] = useState(false)

  useEffect(() => {
    setisTodoListLoading(true)
    todoListProvider
      .getTodoList()
      .then((data) => {
        setTodoList(data)
      })
      .finally(() => {
        setisTodoListLoading(false)
      })
  }, [])

  useEffect(() => {
    todoListProvider.getTodoList().then((data) => {
      setTodoList(data)
    })
  }, [isCreatingloading, isDeleteLoading, isEditLoading, isCompleteLoading])

  const createTodo = async () => {
    if (!createInputRef.current?.value) return

    setIsCreating(false)
    setIsCreatingLoading(true)
    await todoListProvider.createTodo({
      description: createInputRef.current?.value,
    })
    setIsCreatingLoading(false)
  }

  const editTodo = async ({ id }: { id: TodoListEntity['id'] }) => {
    if (!editInputRef.current?.value) return

    setIsEditLoading(true)
    await todoListProvider.updateTodo({
      id,
      description: editInputRef.current?.value,
    })
    setIsEditLoading(false)
  }

  const completeTodo = async ({ id, isComplete }: TodoListUpdateRequest) => {
    setIsCompleteLoading(true)
    await todoListProvider.updateTodo({
      id: id,
      isComplete,
    })
    setIsCompleteLoading(false)
  }

  const deleteTodo = async ({ id }: { id: TodoListEntity['id'] }) => {
    setIsDeleteLoading(true)
    await todoListProvider.deleteTodo({ id })
    setIsDeleteLoading(false)
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
                    <li key={todo.id}>
                      <Editable.Root>
                        <Editable.Input
                          type="text"
                          defaultValue={todo.description}
                          autoFocus
                          ref={editInputRef}
                        />
                        <Editable.Preview>
                          <input
                            type="checkbox"
                            defaultChecked={todo.isComplete}
                            onChange={(e) =>
                              completeTodo({
                                id: todo.id,
                                isComplete: e.target.checked,
                              })
                            }
                          />
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
                                  <Editable.Submit
                                    onClick={() => deleteTodo({ id: todo.id })}
                                  >
                                    삭제
                                  </Editable.Submit>
                                  <Editable.Submit
                                    onClick={() => editTodo({ id: todo.id })}
                                  >
                                    저장
                                  </Editable.Submit>
                                </>
                              ) : null}
                            </>
                          )}
                        </Editable.Control>
                      </Editable.Root>
                    </li>
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

export default App
