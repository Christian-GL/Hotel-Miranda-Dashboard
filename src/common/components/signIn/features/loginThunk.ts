
import { createAsyncThunk } from "@reduxjs/toolkit"
import { AccountInterface } from '../interfaces/accountInterface.ts'


export const LoginThunk = createAsyncThunk
    ("login", async (loginData: AccountInterface, { rejectWithValue }) => {


        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_LOGIN}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            })
            if (request.ok) {
                const token = await request.json()
                return token
            } else {
                console.error("Error: ", request.statusText)
                const errorData = await request.json()
                return rejectWithValue(errorData.message || 'Error: email or password wrong')
            }
        }
        catch (error) {
            console.error(error)
            return rejectWithValue('Error: email or password wrong')
        }

    })