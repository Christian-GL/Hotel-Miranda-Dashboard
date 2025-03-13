
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

export const ContactUpdateThunk = createAsyncThunk
    ("contact/update", async ({ idContact, updatedContactData }
        : { idContact: number, updatedContactData: ContactInterface }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return contactDefaultIfError

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_CONTACTS}/${idContact}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
                body: JSON.stringify(updatedContactData)
            })

            if (request.ok) {
                const contactUpdated = await request.json()
                return contactUpdated
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