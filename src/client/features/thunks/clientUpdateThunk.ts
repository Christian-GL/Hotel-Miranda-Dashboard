
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

export const ClientUpdateThunk = createAsyncThunk
    ("client/update", async ({ idClient, updatedClientData }
        : { idClient: string, updatedClientData: ClientInterface }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return clientDefaultIfError

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
            } else {
                console.log("Error: ", request.statusText)
                return clientDefaultIfError
            }
        }
        catch (error) {
            console.log(error)
            return clientDefaultIfError
        }

    })