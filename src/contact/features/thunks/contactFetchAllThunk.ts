
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

export const ContactFetchAllThunk = createAsyncThunk
    ("contact/fetchAll", async () => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return [contactDefaultIfError]

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_CONTACTS}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                }
            })
            if (request.ok) {
                const json = await request.json()
                let allContacts: ContactInterface[] = []
                for (let i = 0; i < json.length; i++) {
                    allContacts.push({
                        _id: json[i]._id,
                        publish_date: json[i].publish_date,
                        full_name: json[i].full_name,
                        email: json[i].email,
                        phone_number: json[i].phone_number,
                        comment: json[i].comment,
                        archived: json[i].archived
                    })
                }
                return allContacts
            }
            else {
                console.error('Error: ', request.statusText)
                return [contactDefaultIfError]
            }
        }
        catch (error) {
            console.error(error)
            return [contactDefaultIfError]
        }

    })