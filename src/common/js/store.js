import { configureStore } from "@reduxjs/toolkit";
import { ContactSlice } from "../../pages/contact/features/contactSlice";

export const store = configureStore({
    reducer: {
        contactSlice: ContactSlice.reducer
    }
})