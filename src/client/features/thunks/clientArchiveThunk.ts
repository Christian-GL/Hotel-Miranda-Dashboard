
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ClientArchiveResponseInterface } from "../../interfaces/api/responses/clientArchiveResponseInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { ClientArchiveRequestInterface } from "client/interfaces/api/requests/clientArchiveRequestInterface"


export const ClientArchiveThunk = createAsyncThunk<
    ClientArchiveResponseInterface,
    ClientArchiveRequestInterface,
    { rejectValue: ApiErrorResponseInterface }
>(
    "client/archive",
    async ({ idClient, isArchived }, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue({
                status: 401,
                message: 'No authentication token found',
            })
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_CLIENTS}/archive/${idClient}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
                body: JSON.stringify({ isArchived })
            })
            if (request.ok) {
                const clientUpdated = await request.json()
                return clientUpdated
            }
            else {
                const errorData = await request.json().catch(() => null)
                return rejectWithValue({
                    status: request.status,
                    message: errorData?.message ?? 'Error archiving client',
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