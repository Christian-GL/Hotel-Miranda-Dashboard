import { configureStore } from "@reduxjs/toolkit";
import { ContactSlice } from "../../../contact/features/contactSlice.js";
import { RoomSlice } from "../../../room/features/roomSlice";
import { UserSlice } from "../../../user/features/userSlice";
import { BookingSlice } from "../../../bookings/features/bookingSlice";

export const store = configureStore({
    reducer: {
        contactSlice: ContactSlice.reducer,
        roomSlice: RoomSlice.reducer,
        userSlice: UserSlice.reducer,
        bookingSlice: BookingSlice.reducer
    }
})