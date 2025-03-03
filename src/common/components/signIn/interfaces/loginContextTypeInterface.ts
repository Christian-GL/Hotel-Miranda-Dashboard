
export interface LoginContextTypeInterface {
    tryLogin: (email: string, password: string) => Promise<boolean>
    logout: () => void
    isAuthenticated: () => boolean
}