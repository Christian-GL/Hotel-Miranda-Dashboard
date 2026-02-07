
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ClientInterfaceId } from "../../interfaces/clientInterface"


export const ClientFetchByIDThunk = createAsyncThunk<
    ClientInterfaceId,
    string,
    { rejectValue: { status: number; message: string } }
>(
    "client/fetchById",
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
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                }
            })
            if (request.ok) {
                const json = await request.json()
                let client: ClientInterfaceId = {
                    _id: json._id,
                    full_name: json.full_name,
                    email: json.email,
                    phone_number: json.phone_number,
                    isArchived: json.isArchived,
                    booking_id_list: json.booking_id_list
                }
                return client
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
            return rejectWithValue({ status: 500, message: 'Network or server error' })
        }

    })