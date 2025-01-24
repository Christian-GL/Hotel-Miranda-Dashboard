
import { createAsyncThunk } from "@reduxjs/toolkit"

import contactJSON from '../../data/contactData.json'


export const ContactFetchAllThunk = createAsyncThunk("contact/fetchAll", async () => {

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