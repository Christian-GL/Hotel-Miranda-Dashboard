
import { createAsyncThunk } from "@reduxjs/toolkit"
import { UserInterfaceId, UserInterface } from '../../interfaces/userInterface'


export const UserCreateThunk = createAsyncThunk<
    UserInterfaceId,
    UserInterface,
    { rejectValue: string }
>(
    "user/create",
    async (newUserData, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue('No authentication token found')
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_USERS}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
                body: JSON.stringify(newUserData)
            })
            if (request.ok) {
                const userCreated = await request.json()
                return userCreated
            }
            else {
                const errorData = await request.json().catch(() => null)
                return rejectWithValue(
                    errorData?.message ?? request.statusText ?? 'Error fetching user'
                )
            }
        }
        catch (error) {
            return rejectWithValue('Network or server error')
        }

    })