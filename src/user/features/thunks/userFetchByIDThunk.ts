
import { createAsyncThunk } from "@reduxjs/toolkit"
import { UserInterfaceId } from '../../interfaces/userInterface'


export const UserFetchByIDThunk = createAsyncThunk<
    UserInterfaceId,
    string,
    { rejectValue: string }
>(
    "user/fetchById",
    async (userId, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue('No authentication token found')
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_USERS}/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                }
            })
            if (request.ok) {
                const json = await request.json()
                let user: UserInterfaceId = {
                    _id: json._id,
                    photo: json.photo,
                    full_name: json.full_name,
                    email: json.email,
                    phone_number: json.phone_number,
                    start_date: json.start_date,
                    end_date: json.end_date,
                    job_position: json.job_position,
                    role: json.role,
                    password: json.password,
                    isArchived: json.isArchived
                }
                return user
            }
            else {
                const errorData = await request.json().catch(() => null)
                return rejectWithValue(
                    errorData?.message ?? request.statusText ?? 'Error fetching user'
                )
            }
        }
        catch {
            return rejectWithValue('Network or server error')
        }

    })