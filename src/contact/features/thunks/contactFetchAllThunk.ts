
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

// TEMPORAL
const tokenAccesKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ik5hdGhhbmlhbF9NdXJwaHlAeWFob28uY29tIiwiaWF0IjoxNzQwNDA0MTU4LCJleHAiOjE3NDEwMDg5NTh9.MDZKkwNBWOXxilJYj0AB-4Vikxk52KS2OGdvVO83I28'
// const API_URL = process.env.REACT_APP_API_URI || "http://localhost:3002"
const API_URL = "http://localhost:3002"
const API_END_POINT = "api-dashboard/v2/contacts"

export const ContactFetchAllThunk = createAsyncThunk
    ("contact/fetchAll", async () => {

        try {
            const request = await fetch(`${API_URL}/${API_END_POINT}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenAccesKey}`
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
                console.log('Error: ', request.statusText)
                return [contactDefaultIfError]
            }
        }
        catch (error) {
            console.log(error)
            return [contactDefaultIfError]
        }

    })