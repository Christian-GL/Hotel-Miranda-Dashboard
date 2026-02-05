
export interface ButtonCreateInterface extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode
    padding?: string
    fontSize?: string
    isClickDisabled?: boolean
    onClick?: () => void
}