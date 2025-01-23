
import { createAsyncThunk } from "@reduxjs/toolkit"


export const ContactCreateThunk = createAsyncThunk("contact/create", async (newContactData) => {

    try {
        const request = await new Promise((resolve) => {
            if (newContactData) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => newContactData
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
            const contactDataCreated = await request.json()
            return contactDataCreated
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})