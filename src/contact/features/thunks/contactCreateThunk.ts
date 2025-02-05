
import { createAsyncThunk } from "@reduxjs/toolkit"
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

export const ContactCreateThunk = createAsyncThunk
    ("contact/create", async (newContactData: ContactInterface) => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                if (newContactData) {
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => newContactData
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
                const contactDataCreated = await request.json()
                return contactDataCreated
            }
            else return contactDefaultIfError
        }
        catch (error) {
            console.log(error)
            return contactDefaultIfError
        }

    })