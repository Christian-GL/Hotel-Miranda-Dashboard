
import { createAsyncThunk } from "@reduxjs/toolkit"
import { RoomInterfaceId } from "../../interfaces/roomInterface"


export const RoomFetchByIDThunk = createAsyncThunk<
    RoomInterfaceId,
    string,
    { rejectValue: string }
>(
    "room/fetchById",
    async (roomId, { rejectWithValue }) => {

        const apiToken = localStorage.getItem("token")
        if (!apiToken) {
            return rejectWithValue("No authentication token found")
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_ROOMS}/${roomId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                }
            })
            if (request.ok) {
                const json = await request.json()
                let room: RoomInterfaceId = {
                    _id: json._id,
                    photos: json.photos,
                    number: json.number,
                    type: json.type,
                    amenities: json.amenities,
                    price: json.price,
                    discount: json.discount,
                    isActive: json.isActive,
                    isArchived: json.isArchived,
                    booking_id_list: json.booking_id_list
                }
                return room
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