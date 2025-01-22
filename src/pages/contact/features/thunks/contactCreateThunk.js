
import { createAsyncThunk } from "@reduxjs/toolkit"


export const ContactCreateThunk = createAsyncThunk("contact/Create", async (newContactData) => {

    try {
        return newContactData;
    }
    catch (error) {
        console.log(error)
        throw error
    }

})