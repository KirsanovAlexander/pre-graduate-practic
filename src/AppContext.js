import React, {createContext, useState} from 'react'

const AppContext = createContext()

export const AppProvider = ({children}) => {
  const [basename, setBasename] = useState(null)
  return <AppContext.Provider value={{basename, setBasename}}>{children}</AppContext.Provider>
}

export default AppContext
