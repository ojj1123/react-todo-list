import { useRef } from 'react'
import { Editable, Loading } from '.'
import { TodoListEntity, TodoListUpdateRequest, todoListProvider } from '../api'
import { useLoading } from '../hooks'

interface Props {
  todo: TodoListEntity
  onRefetch: () => Promise<void>
}

export const TodoItem = ({ todo, onRefetch }: Props) => {
  const [isDeleteLoading, startDeleteing] = useLoading()
  const [isEditLoading, startEditing] = useLoading()
  const [isCompleteLoading, startCompleting] = useLoading()
  const editInputRef = useRef<HTMLInputElement>(null)

  const editTodo = async (id: TodoListEntity['id']) => {
    if (!editInputRef.current?.value) return

    await todoListProvider.updateTodo({
      id,
      description: editInputRef.current?.value,
    })
  }

  const completeTodo = async ({ id, isComplete }: TodoListUpdateRequest) => {
    await todoListProvider.updateTodo({
      id,
      isComplete,
    })
  }

  const deleteTodo = async (id: TodoListEntity['id']) => {
    await todoListProvider.deleteTodo({ id })
  }

  return (
    <li>
      {isDeleteLoading || isEditLoading ? (
        <Loading />
      ) : (
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
              checked={todo.isComplete}
              disabled={isCompleteLoading}
              onChange={async (e) => {
                await startCompleting(async () => {
                  await completeTodo({
                    id: todo.id,
                    isComplete: e.target.checked,
                  })
                  await onRefetch()
                })
              }}
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
                      onClick={async () => {
                        await startDeleteing(async () => {
                          await deleteTodo(todo.id)
                          await onRefetch()
                        })
                      }}
                    >
                      삭제
                    </Editable.Submit>
                    <Editable.Submit
                      onClick={async () => {
                        await startEditing(async () => {
                          await editTodo(todo.id)
                          await onRefetch()
                        })
                      }}
                    >
                      저장
                    </Editable.Submit>
                  </>
                ) : null}
              </>
            )}
          </Editable.Control>
        </Editable.Root>
      )}
    </li>
  )
}
