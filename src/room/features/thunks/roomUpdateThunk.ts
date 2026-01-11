
import { createAsyncThunk } from "@reduxjs/toolkit"
import { RoomInterface } from "../../interfaces/roomInterface"
import { BookingInterface } from "booking/interfaces/bookingInterface"
import { RoomType } from "../../enums/roomType"
import { OptionYesNo } from "common/enums/optionYesNo"


const roomDefaultIfError: RoomInterface = {
    _id: '0',
    photos: [],
    number: '0',
    type: RoomType.singleBed,
    amenities: [],
    price: 0,
    discount: 0,
    isActive: OptionYesNo.no,
    isArchived: OptionYesNo.yes,
    booking_id_list: []
}

export const RoomUpdateThunk = createAsyncThunk<
    { room: RoomInterface, updatedBookings: BookingInterface[] },
    { idRoom: string; updatedRoomData: RoomInterface }
>(
    "room/update", async ({ idRoom, updatedRoomData }, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue("Missing token")
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

            if (!request.ok) {
                throw new Error(request.statusText)
            }

            return await request.json()
        }
        catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)
