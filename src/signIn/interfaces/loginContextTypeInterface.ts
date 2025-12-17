
export interface LoginResult {
    success: boolean
    error?: string
}

export interface LoginContextTypeInterface {
    tryLogin: (email: string, password: string) => Promise<LoginResult>
    logout: () => void
    isAuthenticated: () => boolean
    getRole: () => string | null
}