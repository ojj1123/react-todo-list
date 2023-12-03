import { v4 as uuidv4 } from 'uuid'
import { waitRandomSecond } from '.'

export interface TodoListEntity {
  id: string
  description: string
  isArchived: boolean
  isComplete: boolean
}
export interface TodoListCreateRequest {
  description: string
}
export interface TodoListUpdateRequest {
  id: string
  description?: string
  isComplete?: boolean
}
export interface TodoListDeleteRequest {
  id: string
}

function TodoListProvider() {
  let todolist: TodoListEntity[] = [
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
    return await waitRandomSecond<TodoListEntity[]>(() =>
      JSON.parse(JSON.stringify(todolist))
    )
  }
  async function createTodo(request: TodoListCreateRequest) {
    await waitRandomSecond(() => {
      todolist.push({
        id: uuidv4(),
        isArchived: false,
        isComplete: false,
        ...request,
      })
    })
  }
  async function updateTodo(request: TodoListUpdateRequest) {
    await waitRandomSecond(() => {
      todolist = todolist.map((todo) =>
        todo.id === request.id ? { ...todo, ...request } : todo
      )
    })
  }
  async function deleteTodo(request: TodoListDeleteRequest) {
    await waitRandomSecond(() => {
      todolist = todolist.map((todo) =>
        todo.id === request.id ? { ...todo, isArchived: true } : todo
      )
    })
  }

  return {
    getTodoList,
    createTodo,
    updateTodo,
    deleteTodo,
  }
}

export const todoListProvider = TodoListProvider()
