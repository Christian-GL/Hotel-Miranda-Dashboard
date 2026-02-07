
import { createAsyncThunk } from "@reduxjs/toolkit"


export const UserDeleteByIdThunk = createAsyncThunk<
    string,
    string,
    { rejectValue: { status: number; message: string } }
>(
    "user/deleteById",
    async (userId, { rejectWithValue }) => {

        const apiToken = localStorage.getItem("token")
        if (!apiToken) {
            return rejectWithValue({
                status: 401,
                message: 'No authentication token found',
            })
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_USERS}/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
            })
            if (request.ok) {
                return userId
            }
            else {
                const errorData = await request.json().catch(() => null)
                return rejectWithValue({
                    status: request.status,
                    message: errorData?.message ?? 'Error fetching user',
                })
            }
        }
        catch (error) {
            return rejectWithValue({ status: 500, message: 'Network or server error' })
        }

    })