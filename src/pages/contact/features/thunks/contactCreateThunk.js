
import { createAsyncThunk } from "@reduxjs/toolkit"


export const ContactCreateThunk = createAsyncThunk("contactCreateThunk", async (newContactData) => {

    try {
        return newContactData;
    }
    catch (error) {
        console.log(error)
        throw error
    }

})