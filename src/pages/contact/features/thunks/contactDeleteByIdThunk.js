
import { createAsyncThunk } from "@reduxjs/toolkit"


export const ContactDeleteByIdThunk = createAsyncThunk("contact/DeleteById", async (ContactIdToDelete) => {

    try {
        return ContactIdToDelete;
    }
    catch (error) {
        console.log(error)
        throw error
    }

})