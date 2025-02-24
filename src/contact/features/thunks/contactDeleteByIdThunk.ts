
import { createAsyncThunk } from "@reduxjs/toolkit"


const tokenAccesKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ik5hdGhhbmlhbF9NdXJwaHlAeWFob28uY29tIiwiaWF0IjoxNzQwNDA0MTU4LCJleHAiOjE3NDEwMDg5NTh9.MDZKkwNBWOXxilJYj0AB-4Vikxk52KS2OGdvVO83I28'
const API_URL = "http://localhost:3002"
const API_END_POINT = "api-dashboard/v2/contacts"

export const ContactDeleteByIdThunk = createAsyncThunk
    ("contact/deleteById", async (idContact: string) => {

        try {
            const request = await fetch(`${API_URL}/${API_END_POINT}/${idContact}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenAccesKey}`
                },
            })
            if (request.ok) {
                return idContact
            } else {
                console.log("Error: ", request.statusText)
                return '0'
            }
        }
        catch (error) {
            console.log(error)
            return '0'
        }

    })