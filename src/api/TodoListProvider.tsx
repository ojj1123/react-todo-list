import { v4 as uuidv4 } from 'uuid'
import { waitHalfSecond } from './waitHalfSecond'

export interface TodoListEntity {
  id: string
  description: string
  isArchived: boolean
  isComplete: boolean
}

function TodoListProvider() {
  const todolist: TodoListEntity[] = [
    {
      id: uuidv4(),
      description: '동료에게 인정과 칭찬을 전달하세요.',
      isArchived: false,
      isComplete: true,
    },
    {
      id: uuidv4(),
      description: '감사한 마음을 표현하세요.',
      isArchived: false,
      isComplete: false,
    },
    {
      id: uuidv4(),
      description: '피드백을 전달해보세요.',
      isArchived: true,
      isComplete: false,
    },
  ]
  async function getTodoList(): Promise<TodoListEntity[]> {
    return await waitHalfSecond<TodoListEntity[]>(() =>
      JSON.parse(JSON.stringify(todolist))
    )
  }
  function createTodo(request) {}
  function updateTodo(request) {}
  function deleteTodo(request) {}

  return {
    getTodoList,
    createTodo,
    updateTodo,
    deleteTodo,
  }
}

export const todoListProvider = TodoListProvider()
