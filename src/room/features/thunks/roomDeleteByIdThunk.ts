
import { createAsyncThunk } from "@reduxjs/toolkit"


export const RoomDeleteByIdThunk = createAsyncThunk
    ("room/deleteById", async (roomId: string) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return '0'

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_ROOMS}/${roomId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
            })
            if (request.ok) {
                return roomId
            } else {
                console.log("Error: ", request.statusText)
                return '0'
            }
        }
        catch (error) {
            console.log(error)
            return '0'
        }

    })