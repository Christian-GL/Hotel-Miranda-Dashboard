
export interface ButtonCreateInterface extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode
    padding?: string
    fontSize?: string
    disabledClick?: boolean
    onClick?: () => void
}