
import { createAsyncThunk } from "@reduxjs/toolkit"
import { UserInterfaceId, UserInterface } from '../../interfaces/userInterface'
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"


export const UserCreateThunk = createAsyncThunk<
    UserInterfaceId,
    UserInterface,
    { rejectValue: ApiErrorResponseInterface }
>(
    "user/create",
    async (newUserData, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue({
                status: 401,
                message: 'No authentication token found',
            })
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
                return rejectWithValue({
                    status: request.status,
                    message: errorData?.message ?? 'Error fetching user',
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