
import { createAsyncThunk } from "@reduxjs/toolkit"
import { RoomInterfaceId } from "../../interfaces/roomInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"


export const RoomFetchAllThunk = createAsyncThunk<
    RoomInterfaceId[],
    void,
    { rejectValue: ApiErrorResponseInterface }
>(
    "room/fetchAll",
    async (_, { rejectWithValue }) => {

        const apiToken = localStorage.getItem("token")
        if (!apiToken) {
            return rejectWithValue({
                status: 401,
                message: 'No authentication token found',
            })
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_ROOMS}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                }
            })
            if (request.ok) {
                const json = await request.json()
                let allRooms: RoomInterfaceId[] = []
                for (let i = 0; i < json.length; i++) {
                    allRooms.push({
                        _id: json[i]._id,
                        photos: json[i].photos,
                        number: json[i].number,
                        type: json[i].type,
                        amenities: json[i].amenities,
                        price: json[i].price,
                        discount: json[i].discount,
                        isActive: json[i].isActive,
                        isArchived: json[i].isArchived,
                        booking_id_list: json[i].booking_id_list
                    })
                }
                return allRooms
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