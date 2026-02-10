
import { createAsyncThunk } from "@reduxjs/toolkit"
import { RoomDeleteResponseInterface } from "../../../common/interfaces/apiResponses/roomDeleteResponseInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"


export const RoomDeleteByIdThunk = createAsyncThunk<
    RoomDeleteResponseInterface,
    string,
    { rejectValue: ApiErrorResponseInterface }
>(
    "room/deleteById",
    async (roomId, { rejectWithValue }) => {

        const apiToken = localStorage.getItem("token")
        if (!apiToken) {
            return rejectWithValue({
                status: 401,
                message: 'No authentication token found',
            })
        }

        try {
            const request = await fetch(
                `${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_ROOMS}/${roomId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiToken}`
                    }
                }
            )
            if (request.ok) {
                return await request.json() as RoomDeleteResponseInterface
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
    }
)
