
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ClientInterface, ClientInterfaceId } from "../../interfaces/clientInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"


export const ClientCreateThunk = createAsyncThunk<
    ClientInterfaceId,
    ClientInterface,
    { rejectValue: ApiErrorResponseInterface }
>(
    "client/create",
    async (newClientData, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue({
                status: 401,
                message: 'No authentication token found',
            })
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
                return rejectWithValue({
                    status: request.status,
                    message: errorData?.message ?? 'Error fetching client',
                })
            }
        }
        catch (error) {
            return rejectWithValue({
                status: 500,
                message: 'Network or server error'
            })
        }

    })