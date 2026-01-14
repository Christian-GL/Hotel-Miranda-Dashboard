
import { createAsyncThunk } from "@reduxjs/toolkit"
import { RoomInterface, RoomInterfaceNoId } from '../../interfaces/roomInterface'


export const RoomCreateThunk = createAsyncThunk<
    RoomInterface,
    RoomInterfaceNoId,
    { rejectValue: string }
>(
    "room/create",
    async (newRoomData, { rejectWithValue }) => {

        const apiToken = localStorage.getItem("token")
        if (!apiToken) {
            return rejectWithValue("No authentication token found")
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_ROOMS}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
                body: JSON.stringify(newRoomData)
            })
            if (request.ok) {
                const roomCreated = await request.json()
                return roomCreated
            }
            else {
                const errorData = await request.json().catch(() => null)
                return rejectWithValue(
                    errorData?.message ?? request.statusText ?? 'Error fetching room'
                )
            }
        }
        catch (error) {
            return rejectWithValue('Network or server error')
        }

    })