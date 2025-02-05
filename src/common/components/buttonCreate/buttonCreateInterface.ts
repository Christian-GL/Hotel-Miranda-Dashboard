
export interface ButtonCreateInterface extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode
    fontSize?: string
    onClick?: () => void
}