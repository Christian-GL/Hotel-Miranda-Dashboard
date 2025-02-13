
export interface ActionInterface {
    type: 'LOGIN' | 'LOGOUT'
    payload?: { email: string, password: string }
}