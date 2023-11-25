import './App.css'

function App() {
  return (
    <>
      <h1>오늘 할 일</h1>
      <section>
        <ul>
          <li>
            <input type="checkbox" />
            <span>나는 오늘 일하러 가야한다</span>
          </li>
          <li>
            <input type="checkbox" />
            <span>나는 오늘 일하러 가야한다</span>
          </li>
          <li>
            <input type="text" />
            <button type="button">취소</button>
            <button type="button">삭제</button>
            <button type="button">저장</button>
          </li>
          <li>
            <input type="text" />
            <button type="button">취소</button>
            <button type="button">추가</button>
          </li>
        </ul>
        <button type="button">오늘의 할일 추가하기</button>
      </section>

      <h1>아카이브</h1>
      <section>
        <ul>
          <li>
            <span>나는 오늘 일하러 가야한다</span>
          </li>
        </ul>
      </section>
    </>
  )
}

export default App
