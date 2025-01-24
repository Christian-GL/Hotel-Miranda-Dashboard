
import { createAsyncThunk } from "@reduxjs/toolkit"


export const ContactDeleteByIdThunk = createAsyncThunk("contact/deleteById", async (contactIdToDelete) => {

    try {
        const request = await new Promise((resolve) => {
            if (contactIdToDelete) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => contactIdToDelete
                }), 200)
            }
            else {
                setTimeout(() => resolve({
                    ok: false,
                    json: () => { }
                }), 200)
            }

        })

        if (request.ok) {
            const contactDataDeleted = await request.json()
            return contactDataDeleted
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})