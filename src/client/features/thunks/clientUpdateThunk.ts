
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ClientInterfaceId } from "../../interfaces/clientInterface"

import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { ClientUpdateRequestInterface } from "../../interfaces/api/requests/clientUpdateRequestInterface"


export const ClientUpdateThunk = createAsyncThunk<
    ClientInterfaceId,
    ClientUpdateRequestInterface,
    { rejectValue: ApiErrorResponseInterface }
>(
    "client/update",
    async ({ idClient, updatedClientData }, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue({
                status: 401,
                message: 'No authentication token found',
            })
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
                return await request.json() as ClientInterfaceId
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