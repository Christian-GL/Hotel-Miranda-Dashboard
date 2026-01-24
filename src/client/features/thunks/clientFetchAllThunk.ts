
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ClientInterfaceId } from "../../interfaces/clientInterface"


export const ClientFetchAllThunk = createAsyncThunk<
    ClientInterfaceId[],
    void,
    { rejectValue: string }
>(
    "client/fetchAll",
    async (_, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue('No authentication token found')
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_CLIENTS}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                }
            })
            if (request.ok) {
                const json = await request.json()
                let allClients: ClientInterfaceId[] = []
                for (let i = 0; i < json.length; i++) {
                    allClients.push({
                        _id: json[i]._id,
                        full_name: json[i].full_name,
                        email: json[i].email,
                        phone_number: json[i].phone_number,
                        isArchived: json[i].isArchived,
                        booking_id_list: json[i].booking_id_list
                    })
                }
                return allClients
            }
            else {
                const errorData = await request.json().catch(() => null)
                return rejectWithValue(
                    errorData?.message ?? request.statusText ?? 'Error fetching clients'
                )
            }
        }
        catch (error) {
            return rejectWithValue('Network or server error')
        }

    })