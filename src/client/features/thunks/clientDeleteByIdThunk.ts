
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ClientDeleteResponseInterface } from '../../../common/interfaces/apiResponses/clientDeleteResponseInterface'
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"


export const ClientDeleteByIdThunk = createAsyncThunk<
    ClientDeleteResponseInterface,
    string,
    { rejectValue: ApiErrorResponseInterface }
>(
    "client/deleteById",
    async (clientId, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue({
                status: 401,
                message: 'No authentication token found',
            })
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
                const data: ClientDeleteResponseInterface = await request.json()
                return data
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