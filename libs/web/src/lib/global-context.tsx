import * as React from 'react'
import { ReactNode } from 'react'

import { MeQuery } from '@nestled-template/shared/sdk'


interface GlobalProviderContextValue {
  user?: MeQuery['me'] | null
}

const GlobalContext = React.createContext<GlobalProviderContextValue | undefined>(undefined)

export function useGlobalCtx() {
  const context = React.useContext(GlobalContext)
  console.debug('[global-context.tsx useGlobalCtx] context', context)
  if (!context) {
    throw new Error('useGlobalCtx must be used within a GlobalContextProvider')
  }
  return context
}

interface GlobalContextProviderProps {
  children: ReactNode
  user?: MeQuery['me'] | null
}

export function GlobalContextProvider({
  children,
  user = null,
}: Readonly<GlobalContextProviderProps>) {
  console.debug('[global-context.tsx GlobalContextProvider] user', user)
  const value = React.useMemo(() => ({ user }), [user])
  console.debug('[global-context.tsx GlobalContextProvider] value', value)
  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}
