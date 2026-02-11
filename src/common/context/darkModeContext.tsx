
import { createContext, useState, PropsWithChildren } from "react"
import { DarkModeInterface } from "./darkModeInterface"
import { ThemeType } from "common/enums/themeType"


export const Theme = createContext<DarkModeInterface>({
    theme: ThemeType.light,
    setTheme: () => { }
})

export const DarkModeProvider = ({ children }: PropsWithChildren) => {
    const [theme, setTheme] = useState<ThemeType>(ThemeType.light)

    return (
        <Theme.Provider value={{ theme, setTheme }}>
            {children}
        </Theme.Provider>
    )
}