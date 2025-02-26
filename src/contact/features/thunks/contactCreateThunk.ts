
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ContactInterface } from "../../interfaces/contactInterface.ts"


const contactDefaultIfError: ContactInterface = {
    _id: '',
    publish_date: '',
    full_name: '',
    email: '',
    phone_number: '',
    comment: '',
    archived: false
}

export const ContactCreateThunk = createAsyncThunk
    ("contact/create", async (newContactData: Partial<ContactInterface>) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return contactDefaultIfError

        if (newContactData.publish_date === undefined) { console.error('contact.publish_date is undefined'); return contactDefaultIfError }
        if (newContactData.full_name === undefined) { console.error('contact.full_name is undefined'); return contactDefaultIfError }
        if (newContactData.email === undefined) { console.error('contact.email is undefined'); return contactDefaultIfError }
        if (newContactData.phone_number === undefined) { console.error('contact.phone_number is undefined'); return contactDefaultIfError }
        if (newContactData.comment === undefined) { console.error('contact.comment is undefined'); return contactDefaultIfError }
        if (newContactData.archived === undefined) { console.error('contact.archived is undefined'); return contactDefaultIfError }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_CONTACTS}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
                body: JSON.stringify(newContactData)
            })
            if (request.ok) {
                const contactCreated = await request.json()
                return contactCreated
            } else {
                console.log("Error: ", request.statusText)
                return contactDefaultIfError
            }
        }
        catch (error) {
            console.log(error)
            return contactDefaultIfError
        }

    })