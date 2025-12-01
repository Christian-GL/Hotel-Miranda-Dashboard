
import React from "react"
import { createContext, useState } from "react"
import { DarkModeInterface } from "./darkModeInterface"


export const Theme = createContext<DarkModeInterface>({
    theme: 'light',
    setTheme: () => { }
})

export const DarkModeProvider = ({ children }) => {
    const [theme, setTheme] = useState<string>('light')

    return (
        <Theme.Provider value={{ theme, setTheme }}>
            {children}
        </Theme.Provider>
    )
}