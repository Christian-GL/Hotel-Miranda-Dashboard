
import { createAsyncThunk } from "@reduxjs/toolkit"

import contactJSON from '../../data/contactData.json'
import { ContactInterface } from "../../interfaces/contactInterface"


type RequestResponse = {
    ok: boolean
    json: () => ContactInterface[]
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

export const ContactFetchAllThunk = createAsyncThunk
    ("contact/fetchAll", async () => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => contactJSON
                }), 750)
            })

            if (request.ok) {
                const allContacts = await request.json()
                return allContacts
            }
            else return [contactDefaultIfError]
        }
        catch (error) {
            console.log(error)
            return [contactDefaultIfError]
        }

    })