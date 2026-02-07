
import { createAsyncThunk } from "@reduxjs/toolkit"
import { RoomInterfaceId } from "../../interfaces/roomInterface"
import { RoomUpdateResponseInterface } from "../../../common/interfaces/apiResponses/roomUpdateResponseInterface"


export const RoomUpdateThunk = createAsyncThunk<
    RoomUpdateResponseInterface,
    { idRoom: string; updatedRoomData: RoomInterfaceId },
    { rejectValue: { status: number; message: string } }
>(
    "room/update",
    async ({ idRoom, updatedRoomData }, { rejectWithValue }) => {

        const apiToken = localStorage.getItem("token")
        if (!apiToken) {
            return rejectWithValue({
                status: 401,
                message: 'No authentication token found',
            })
        }

        try {
            const request = await fetch(
                `${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_ROOMS}/${idRoom}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiToken}`
                    },
                    body: JSON.stringify(updatedRoomData)
                }
            )
            if (request.ok) {
                return await request.json()
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
            return rejectWithValue({ status: 500, message: 'Network or server error' })
        }
    }
)
