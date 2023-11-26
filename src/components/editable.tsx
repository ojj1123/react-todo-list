import {
  ButtonHTMLAttributes,
  Dispatch,
  ForwardedRef,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  createContext,
  forwardRef,
  useContext,
  useState,
} from 'react'

const EditableContext = createContext(false)
const EditableSetContext = createContext<Dispatch<SetStateAction<boolean>>>(
  () => {}
)

const useEdittableContext = () => useContext(EditableContext)
const useEdittableSetContext = () => useContext(EditableSetContext)

const Root = ({ children }: PropsWithChildren) => {
  const [isEditing, setIsEditing] = useState(false)
  return (
    <EditableContext.Provider value={isEditing}>
      <EditableSetContext.Provider value={setIsEditing}>
        <div>{children}</div>
      </EditableSetContext.Provider>
    </EditableContext.Provider>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
const Input = forwardRef(function Input(
  props: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const isEditing = useEdittableContext()
  return <>{isEditing ? <input {...props} ref={ref} /> : null} </>
})

const Preview = ({ children }: PropsWithChildren) => {
  const isEditing = useEdittableContext()
  return <>{isEditing || children}</>
}

interface ControlProps {
  children: (props: { isEditing: boolean }) => ReactNode
}
const Control = ({ children }: ControlProps) => {
  const isEditing = useEdittableContext()
  return <>{children({ isEditing })}</>
}

const EditTrigger = ({ children }: PropsWithChildren) => {
  const setIsEditing = useEdittableSetContext()
  return (
    <button type="button" onClick={() => setIsEditing(true)}>
      {children}
    </button>
  )
}

const Cancel = ({ children }: PropsWithChildren) => {
  const setIsEditing = useEdittableSetContext()
  return (
    <button type="button" onClick={() => setIsEditing(false)}>
      {children}
    </button>
  )
}

const Submit = ({
  children,
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const setIsEditing = useEdittableSetContext()
  return (
    <button
      type="submit"
      {...props}
      onClick={(e) => {
        onClick?.(e)
        setIsEditing(false)
      }}
    >
      {children}
    </button>
  )
}
export const Editable = {
  Root,
  Input,
  Preview,
  Control,
  EditTrigger,
  Cancel,
  Submit,
}
