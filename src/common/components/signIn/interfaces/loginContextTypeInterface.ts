
export interface LoginContextTypeInterface {
    tryLogin: (userEmail: string, userPassword: string) => boolean
    logout: () => void
    isAuthenticated: () => boolean
}