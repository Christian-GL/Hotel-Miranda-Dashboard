
import { createAsyncThunk } from "@reduxjs/toolkit"


export const RoomDeleteByIdThunk = createAsyncThunk
    ("room/deleteById", async (roomId: number) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return { roomId: 0, bookingsToDelete: [] }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_ROOMS}/${roomId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
            })
            if (request.ok) {
                const responseData = await request.json()
                return responseData
            } else {
                console.log("Error: ", request.statusText)
                return { roomId: 0, bookingsToDelete: [] }
            }
        }
        catch (error) {
            console.log(error)
            return { roomId: 0, bookingsToDelete: [] }
        }

    })