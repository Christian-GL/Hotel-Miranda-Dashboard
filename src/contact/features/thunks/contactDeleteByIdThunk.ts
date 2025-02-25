
import { createAsyncThunk } from "@reduxjs/toolkit"
import { apiUrl, apiEndPointContacts, apiToken } from "../../../common/globalParameters/routes.ts"


export const ContactDeleteByIdThunk = createAsyncThunk
    ("contact/deleteById", async (contactId: string) => {

        try {
            const request = await fetch(`${apiUrl}/${apiEndPointContacts}/${contactId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
            })
            if (request.ok) {
                return contactId
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