import { configureStore } from "@reduxjs/toolkit";
import { ContactSlice } from "../../pages/contact/features/contactSlice";
import { RoomSlice } from "../../pages/room/features/roomSlice";

export const store = configureStore({
    reducer: {
        contactSlice: ContactSlice.reducer,
        roomSlice: RoomSlice.reducer
    }
})