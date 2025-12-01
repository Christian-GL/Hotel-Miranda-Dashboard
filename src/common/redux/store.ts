
import { configureStore } from "@reduxjs/toolkit"
import { ContactSlice } from "../../contact/features/contactSlice"
import { RoomSlice } from "../../room/features/roomSlice.js"
import { UserSlice } from "../../user/features/userSlice"
import { BookingSlice } from "../../booking/features/bookingSlice.js"

export const store = configureStore({
    reducer: {
        contactSlice: ContactSlice.reducer,
        roomSlice: RoomSlice.reducer,
        userSlice: UserSlice.reducer,
        bookingSlice: BookingSlice.reducer
    }
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']