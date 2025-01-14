
import { configureStore } from "@reduxjs/toolkit";
import { SessionSlice } from "./sessionSlice";


export const store = configureStore({
    reducer: {
        session: SessionSlice.reducer
    }
})