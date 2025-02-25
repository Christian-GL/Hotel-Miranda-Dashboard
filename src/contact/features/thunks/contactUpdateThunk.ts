
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ContactInterface } from "../../interfaces/contactInterface.ts"
import { apiUrl, apiEndPointContacts, apiToken } from "../../../common/globalParameters/routes.ts"


const contactDefaultIfError: ContactInterface = {
    _id: '',
    publish_date: '',
    full_name: '',
    email: '',
    phone_number: '',
    comment: '',
    archived: false
}

export const ContactUpdateThunk = createAsyncThunk
    ("contact/update", async ({ idContact, updatedContactData }
        : { idContact: string, updatedContactData: ContactInterface }) => {

        try {
            const request = await fetch(`${apiUrl}/${apiEndPointContacts}/${idContact}`, {
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