import { useState } from 'react'

export const TodoListForm = () => {
  const [isCreating, setIsCreating] = useState(false)
  /**
   * TODO
   * - todolist 추가하는 비동기 로직 작성
   */
  return (
    <>
      {isCreating ? (
        <li>
          <input type="text" />
          <button type="button" onClick={() => setIsCreating(false)}>
            취소
          </button>
          <button type="button">추가</button>
        </li>
      ) : (
        <button type="button" onClick={() => setIsCreating(true)}>
          오늘의 할일 추가하기
        </button>
      )}
    </>
  )
}
