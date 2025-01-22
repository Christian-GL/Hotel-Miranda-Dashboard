
import { createAsyncThunk } from "@reduxjs/toolkit"


export const ContactUpdateByIdThunk = createAsyncThunk("contact/UpdateById", async (ContactIdToUpdate) => {

    try {
        return ContactIdToUpdate;
    }
    catch (error) {
        console.log(error)
        throw error
    }

})