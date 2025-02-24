
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ContactInterface } from "../../interfaces/contactInterface"


const contactDefaultIfError: ContactInterface = {
    _id: '',
    publish_date: '',
    full_name: '',
    email: '',
    phone_number: '',
    comment: '',
    archived: false
}

const tokenAccesKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ik5hdGhhbmlhbF9NdXJwaHlAeWFob28uY29tIiwiaWF0IjoxNzQwNDA0MTU4LCJleHAiOjE3NDEwMDg5NTh9.MDZKkwNBWOXxilJYj0AB-4Vikxk52KS2OGdvVO83I28'
const API_URL = "http://localhost:3002"
const API_END_POINT = "api-dashboard/v2/contacts"

export const ContactUpdateThunk = createAsyncThunk
    ("contact/update", async ({ idContact, updatedContactData }
        : { idContact: string, updatedContactData: ContactInterface }) => {

        try {
            const request = await fetch(`${API_URL}/${API_END_POINT}/${idContact}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenAccesKey}`
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