
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ContactInterface } from "../../interfaces/contactInterface.ts"
import { ContactArchivedType } from "../../enums/ContactArchivedType.ts"


const contactDefaultIfError: ContactInterface = {
    _id: 0,
    publish_date: '',
    full_name: '',
    email: '',
    phone_number: '',
    comment: '',
    archived: ContactArchivedType.notArchived
}

export const ContactFetchByIDThunk = createAsyncThunk
    ("contact/fetchById", async (contactId: number) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return contactDefaultIfError

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_CONTACTS}/${contactId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                }
            })
            if (request.ok) {
                const json = await request.json()
                let contact: ContactInterface = {
                    _id: json._id,
                    publish_date: json.publish_date,
                    full_name: json.full_name,
                    email: json.email,
                    phone_number: json.phone_number,
                    comment: json.comment,
                    archived: json.archived
                }
                return contact
            }
            else {
                console.log('Error: ', request.statusText)
                return contactDefaultIfError
            }
        }
        catch (error) {
            console.log(error)
            return contactDefaultIfError
        }

    })