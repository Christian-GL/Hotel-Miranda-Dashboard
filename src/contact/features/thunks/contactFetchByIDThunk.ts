
import { createAsyncThunk } from "@reduxjs/toolkit"

import contactJSON from '../../data/contactData.json'
import { ContactInterface } from "../../interfaces/contactInterface"


type RequestResponse = {
    ok: boolean
    json: () => ContactInterface
}

const contactDefaultIfError: ContactInterface = {
    id: 0,
    publish_date: '',
    publish_time: '',
    full_name: '',
    email: '',
    contact: '',
    comment: ''
}

export const ContactFetchByIDThunk = createAsyncThunk
    ("contact/fetchById", async (contactId: number) => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
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
                        json: () => contactDefaultIfError
                    }), 200)
                }

            })

            if (request.ok) {
                const contactFinded = await request.json()
                return contactFinded
            }
            else return contactDefaultIfError
        }
        catch (error) {
            console.log(error)
            return contactDefaultIfError
        }

    })