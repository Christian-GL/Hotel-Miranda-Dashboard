
import { ThemeType } from "common/enums/themeType"


export interface DarkModeInterface {
    theme: ThemeType
    setTheme: React.Dispatch<React.SetStateAction<ThemeType>>
}