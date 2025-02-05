
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

export const ContactUpdateThunk = createAsyncThunk
    ("contact/update", async (contactData: ContactInterface) => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                if (contactData) {
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => contactData
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
                const contactDataUpdated = await request.json()
                return contactDataUpdated
            }
            else return contactDefaultIfError
        }
        catch (error) {
            console.log(error)
            return contactDefaultIfError
        }

    })