
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ClientInterface } from "../../interfaces/clientInterface"
import { OptionYesNo } from "common/enums/optionYesNo"


const clientDefaultIfError: ClientInterface = {
    _id: "0",
    full_name: '',
    email: '',
    phone_number: '',
    isArchived: OptionYesNo.no,
    booking_id_list: []
}

export const ClientFetchByIDThunk = createAsyncThunk
    ("client/fetchById", async (clientId: string) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return clientDefaultIfError

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
                let client: ClientInterface = {
                    _id: json._id,
                    full_name: json.full_name,
                    email: json.email,
                    phone_number: json.phone_number,
                    isArchived: json.archived,
                    booking_id_list: json.booking_id_list
                }
                return client
            }
            else {
                console.log('Error: ', request.statusText)
                return clientDefaultIfError
            }
        }
        catch (error) {
            console.log(error)
            return clientDefaultIfError
        }

    })