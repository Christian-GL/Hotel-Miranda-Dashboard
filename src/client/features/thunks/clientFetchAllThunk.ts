
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

export const ClientFetchAllThunk = createAsyncThunk
    ("client/fetchAll", async () => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return [clientDefaultIfError]

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
                let allClients: ClientInterface[] = []
                for (let i = 0; i < json.length; i++) {
                    allClients.push({
                        _id: json[i]._id,
                        full_name: json[i].full_name,
                        email: json[i].email,
                        phone_number: json[i].phone_number,
                        isArchived: json[i].archived,
                        booking_id_list: json[i].booking_id_list
                    })
                }
                return allClients
            }
            else {
                console.error('Error: ', request.statusText)
                return [clientDefaultIfError]
            }
        }
        catch (error) {
            console.error(error)
            return [clientDefaultIfError]
        }

    })