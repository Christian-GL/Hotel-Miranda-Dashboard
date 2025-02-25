
import { createAsyncThunk } from "@reduxjs/toolkit"
import { apiUrl, apiEndPointUsers, apiToken } from '../../../common/globalParameters/routes.ts'


export const UserDeleteByIdThunk = createAsyncThunk
    ("user/deleteById", async (userId: string) => {

        try {
            const request = await fetch(`${apiUrl}/${apiEndPointUsers}/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
            })
            if (request.ok) {
                return userId
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