import { configureStore } from "@reduxjs/toolkit";
import { ContactSlice } from "../../pages/contact/features/contactSlice";
import { RoomSlice } from "../../pages/room/features/roomSlice";
import { UserSlice } from "../../pages/user/features/userSlice";

export const store = configureStore({
    reducer: {
        contactSlice: ContactSlice.reducer,
        roomSlice: RoomSlice.reducer,
        userSlice: UserSlice.reducer
    }
})