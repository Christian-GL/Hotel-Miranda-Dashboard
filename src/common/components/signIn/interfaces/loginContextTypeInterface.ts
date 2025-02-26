
export interface LoginContextTypeInterface {
    tryLogin: (userEmail: string, userPassword: string) => Promise<boolean>
    logout: () => void
    isAuthenticated: () => boolean
}