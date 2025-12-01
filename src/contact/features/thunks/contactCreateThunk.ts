
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ContactInterfaceNoId } from "../../interfaces/contactInterface"
import { ContactArchivedType } from '../../enums/contactArchivedType'


const contactDefaultIfError: ContactInterfaceNoId = {
    publish_date: '',
    full_name: '',
    email: '',
    phone_number: '',
    comment: '',
    archived: ContactArchivedType.notArchived
}

export const ContactCreateThunk = createAsyncThunk
    ("contact/create", async (newContactData: ContactInterfaceNoId) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return contactDefaultIfError

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