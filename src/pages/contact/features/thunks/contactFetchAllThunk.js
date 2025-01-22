
import { createAsyncThunk } from "@reduxjs/toolkit"

import contactJSON from '../../../../common/data/contactData.json'


export const ContactFetchAllThunk = createAsyncThunk("contact/FetchAll", async () => {

    try {
        const request = await new Promise((resolve) => {
            setTimeout(() => resolve({
                ok: true,
                json: () => contactJSON
            }), 200)
        })

        if (request.ok) {
            const allContacts = await request.json()
            return allContacts
        }
        else return []
    }
    catch (error) {
        console.log(error)
        throw error
    }

})