
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ClientInterface } from "../../interfaces/clientInterface"
import { ClientArchivedType } from "../../enums/clientArchivedType"


const clientDefaultIfError: ClientInterface = {
    _id: "0",
    publish_date: '',
    full_name: '',
    email: '',
    phone_number: '',
    comment: '',
    archived: ClientArchivedType.notArchived
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