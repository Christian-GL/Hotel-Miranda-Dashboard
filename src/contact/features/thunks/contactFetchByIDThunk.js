
import { createAsyncThunk } from "@reduxjs/toolkit"

import contactJSON from '../../data/contactData.json'


export const ContactFetchByIDThunk = createAsyncThunk("contact/fetchById", async (contactId) => {

    try {
        const request = await new Promise((resolve) => {
            const contact = contactJSON.find((contact) => contact.id === contactId);
            if (contact) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => contact
                }), 200)
            }
            else {
                setTimeout(() => resolve({
                    ok: false,
                    json: () => {}
                }), 200)
            }

        })

        if (request.ok) {
            const contactFinded = await request.json()
            return contactFinded
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})