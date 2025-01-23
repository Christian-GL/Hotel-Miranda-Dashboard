
import { createAsyncThunk } from "@reduxjs/toolkit"


export const ContactDeleteByIdThunk = createAsyncThunk("contact/DeleteById", async (ContactIdToDelete) => {

    try {
        const request = await new Promise((resolve) => {
            if (ContactIdToDelete) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => ContactIdToDelete
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