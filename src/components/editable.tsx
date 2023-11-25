import {
  ButtonHTMLAttributes,
  Dispatch,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  createContext,
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
const Input = (props: InputProps) => {
  const isEditing = useEdittableContext()
  return <>{isEditing ? <input {...props} /> : null} </>
}

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
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button type="submit" {...props}>
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
