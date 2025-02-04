
import { createAsyncThunk } from "@reduxjs/toolkit"


export const ContactUpdateThunk = createAsyncThunk("contact/update", async (contactData) => {

    try {
        const request = await new Promise((resolve) => {
            if (contactData) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => contactData
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