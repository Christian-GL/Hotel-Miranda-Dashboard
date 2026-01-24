
import { createAsyncThunk } from "@reduxjs/toolkit"
import { UserInterfaceId, UserInterface } from '../../interfaces/userInterface'


export const UserUpdateThunk = createAsyncThunk<
    UserInterfaceId,
    { idUser: string; updatedUserData: UserInterface },
    { rejectValue: string }
>(
    "user/update",
    async ({ idUser, updatedUserData }, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue('No authentication token found')
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_USERS}/${idUser}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
                body: JSON.stringify(updatedUserData)
            })

            if (request.ok) {
                const userUpdated = await request.json()
                return userUpdated
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