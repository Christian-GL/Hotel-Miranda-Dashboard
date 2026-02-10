
import { createAsyncThunk } from "@reduxjs/toolkit"
import { RoomInterfaceId, RoomInterface } from '../../interfaces/roomInterface'
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"


export const RoomCreateThunk = createAsyncThunk<
    RoomInterfaceId,
    RoomInterface,
    { rejectValue: ApiErrorResponseInterface }
>(
    "room/create",
    async (newRoomData, { rejectWithValue }) => {

        const apiToken = localStorage.getItem("token")
        if (!apiToken) {
            return rejectWithValue({
                status: 401,
                message: 'No authentication token found',
            })
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
                return rejectWithValue({
                    status: request.status,
                    message: errorData?.message ?? 'Error fetching room',
                })
            }
        }
        catch (error) {
            return rejectWithValue({
                status: 500,
                message: 'Network or server error'
            })
        }

    })