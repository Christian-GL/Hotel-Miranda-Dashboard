
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { RoomArchiveRequestInterface } from "../../interfaces/api/requests/roomArchiveRequestInterface"
import { RoomArchiveResponseInterface } from "../../interfaces/api/responses/roomArchiveResponseInterface"


export const RoomArchiveThunk = createAsyncThunk<
    RoomArchiveResponseInterface,
    RoomArchiveRequestInterface,
    { rejectValue: ApiErrorResponseInterface }
>(
    "room/archive",
    async ({ idRoom, isArchived }, { rejectWithValue }) => {

        const apiToken = localStorage.getItem("token")
        if (!apiToken) {
            return rejectWithValue({
                status: 401,
                message: 'No authentication token found',
            })
        }

        try {
            const request = await fetch(
                `${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_ROOMS}/archive/${idRoom}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiToken}`
                    },
                    body: JSON.stringify({ isArchived })
                }
            )
            if (request.ok) {
                const roomUpdated = await request.json()
                return roomUpdated
            }
            else {
                const errorData = await request.json().catch(() => null)
                return rejectWithValue({
                    status: request.status,
                    message: errorData?.message ?? 'Error archiving room',
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
