
import { createAsyncThunk } from "@reduxjs/toolkit"


export const ContactUpdateByIdThunk = createAsyncThunk("contact/updateById", async (contactIdToUpdate) => {

    try {
        const request = await new Promise((resolve) => {
            if (contactIdToUpdate) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => contactIdToUpdate
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
            const contactDataUpdated = await request.json()
            return contactDataUpdated
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})