
import { configureStore } from "@reduxjs/toolkit"

import { BookingSlice } from "booking/features/bookingSlice.js"
import { ClientSlice } from "client/features/clientSlice"
import { authMiddleware } from "common/redux/middleware"
import { RoomSlice } from "room/features/roomSlice.js"
import { UserSlice } from "user/features/userSlice"


export const store = configureStore({
    reducer: {
        clientSlice: ClientSlice.reducer,
        roomSlice: RoomSlice.reducer,
        userSlice: UserSlice.reducer,
        bookingSlice: BookingSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authMiddleware)
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']