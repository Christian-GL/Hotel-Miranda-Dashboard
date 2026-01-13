
import { createAsyncThunk } from "@reduxjs/toolkit"


export const ClientDeleteByIdThunk = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>(
    "client/deleteById",
    async (clientId, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue('No authentication token found')
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_CLIENTS}/${clientId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
            })
            if (request.ok) {
                return clientId
            } else {
                const errorData = await request.json().catch(() => null)
                return rejectWithValue(
                    errorData?.message ?? request.statusText ?? 'Error fetching client'
                )
            }
        }
        catch (error) {
            return rejectWithValue('Network or server error')
        }

    })