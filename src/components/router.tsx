import {
  Children,
  cloneElement,
  ComponentType,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react'

const pushStateEvent = new CustomEvent('pushstate')
const replaceStateEvent = new CustomEvent('replacestate')

export function Router({ children }: PropsWithChildren) {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname
  )

  // pushstate 이벤트 받기
  // pop state 이벤트 받기
  useEffect(() => {
    const abortController = new AbortController()
    const handleEvent = () => {
      // 현재 path 변경
      setCurrentPath(window.location.pathname)
    }

    // NOTE: popstate 이벤트: 뒤로가기/앞으로가기 할 때 발생하는 이벤트
    window.addEventListener('popstate', handleEvent, {
      signal: abortController.signal,
    })
    // pushstate 이벤트: history.pushState 실행 시 트리거되는 이벤트
    window.addEventListener('pushstate', handleEvent, {
      signal: abortController.signal,
    })
    window.addEventListener('replacestate', handleEvent, {
      signal: abortController.signal,
    })
    return () => {
      abortController.abort()
    }
  }, [])

  // 현재 path와 일치하는 children 컴포넌트 렌더링
  const rendered = (
    Children.toArray(children) as ReactElement<RouteProps>[]
  ).find((child) => child.props.path === currentPath)

  return <>{rendered ? cloneElement(rendered) : null}</>
}

interface RouteProps {
  path: string
  component: ComponentType<unknown>
}

export function Route({ component: Component }: RouteProps) {
  return <Component />
}

export function Link({
  to,
  children,
  replace = false,
}: PropsWithChildren<{ to: string; replace?: boolean }>) {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    if (replace) {
      window.history.replaceState({}, '', to)
      window.dispatchEvent(replaceStateEvent)
    } else {
      window.history.pushState({}, '', to)
      window.dispatchEvent(pushStateEvent)
    }
  }
  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  )
}
