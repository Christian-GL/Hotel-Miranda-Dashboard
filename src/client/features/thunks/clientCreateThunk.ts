
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ClientInterfaceNoId } from "../../interfaces/clientInterface"
import { ClientArchivedType } from '../../enums/clientArchivedType'


const clientDefaultIfError: ClientInterfaceNoId = {
    publish_date: '',
    full_name: '',
    email: '',
    phone_number: '',
    comment: '',
    archived: ClientArchivedType.notArchived
}

export const ClientCreateThunk = createAsyncThunk
    ("client/create", async (newClientData: ClientInterfaceNoId) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return clientDefaultIfError

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