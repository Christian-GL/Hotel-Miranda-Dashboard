
export interface ActionInterface {
    type: 'LOGIN' | 'LOGOUT'
    payload?: { userEmail: string, userPassword: string }
}