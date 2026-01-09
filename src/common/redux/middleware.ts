
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