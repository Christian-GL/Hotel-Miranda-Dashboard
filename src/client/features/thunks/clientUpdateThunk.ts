
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ClientInterface, ClientInterfaceNoId } from "../../interfaces/clientInterface"


export const ClientUpdateThunk = createAsyncThunk<
    ClientInterface,
    { idClient: string; updatedClientData: ClientInterfaceNoId },
    { rejectValue: string }
>(
    "client/update",
    async ({ idClient, updatedClientData }, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue('No authentication token found')
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_CLIENTS}/${idClient}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
                body: JSON.stringify(updatedClientData)
            })

            if (request.ok) {
                const clientUpdated = await request.json()
                return clientUpdated
            }
            else {
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