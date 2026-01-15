
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ClientInterface, ClientInterfaceNoId } from "../../interfaces/clientInterface"


export const ClientCreateThunk = createAsyncThunk<
    ClientInterface,
    ClientInterfaceNoId,
    { rejectValue: string }
>(
    "client/create",
    async (newClientData, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue('No authentication token found')
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_CLIENTS}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
                body: JSON.stringify(newClientData)
            })
            if (request.ok) {
                const clientCreated = await request.json()
                return clientCreated
            }
            else {
                const errorData = await request.json().catch(() => null)
                return rejectWithValue(
                    errorData?.message ?? request.statusText ?? 'Error creating client'
                )
            }
        }
        catch (error) {
            return rejectWithValue('Network or server error')
        }

    })