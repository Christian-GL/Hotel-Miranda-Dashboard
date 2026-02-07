
// !!!
// import { Middleware, isRejected } from "@reduxjs/toolkit"
// export const authMiddleware: Middleware = store => next => action => {
//     if (action.type.endsWith("/rejected")) {
//         const errorMessage = action.error?.message || ""
//         if (errorMessage.includes("401") || errorMessage.includes("403")) {
//             console.warn("Token expired, redirecting to login...")
//             localStorage.removeItem("token");
//             // window.location.href = "/login"
//         }
//     }
//     return next(action)
// }




// !!! OPTIMIZAR
import { Middleware, isRejectedWithValue } from "@reduxjs/toolkit"


const hasStatus = (payload: unknown): payload is { status?: number; code?: number } => {
    return typeof payload === "object" && payload !== null
}

export const authMiddleware: Middleware = () => next => action => {
    if (isRejectedWithValue(action) && hasStatus(action.payload)) {
        const status = action.payload.status ?? action.payload.code
        if (status === 401 || status === 403) {
            localStorage.removeItem("token")
            localStorage.removeItem("loggedUserID")
            localStorage.removeItem("role")
            window.dispatchEvent(new Event("logout"))
        }
    }

    return next(action)
}