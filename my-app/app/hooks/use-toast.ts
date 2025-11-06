import * as React from "react"

type ToastProps = {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  duration?: number
  variant?: 'default' | 'success' | 'error' | 'warning'
}

type ToasterToast = ToastProps & {
  id: string
  visible: boolean
}

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000 // 5 seconds default

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

interface State {
  toasts: ToasterToast[]
}

type Action =
  | {
      type: typeof actionTypes.ADD_TOAST
      toast: ToasterToast
    }
  | {
      type: typeof actionTypes.REMOVE_TOAST
      toastId: string
    }

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function toast({ 
  title, 
  description, 
  duration = TOAST_REMOVE_DELAY,
  variant = 'default'
}: Omit<ToastProps, 'id'>) {
  const id = genId()

  dispatch({
    type: "ADD_TOAST",
    toast: {
      id,
      title,
      description,
      variant,
      visible: true
    },
  })

  // Automatically remove toast after duration
  setTimeout(() => {
    dispatch({ type: "REMOVE_TOAST", toastId: id })
  }, duration)

  return {
    id,
    dismiss: () => dispatch({ type: "REMOVE_TOAST", toastId: id }),
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    toasts: state.toasts,
    toast,
    dismiss: (toastId: string) => dispatch({ type: "REMOVE_TOAST", toastId }),
  }
}

export { useToast, toast }
export type { ToastProps }