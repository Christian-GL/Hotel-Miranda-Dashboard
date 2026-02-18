
import { createAsyncThunk } from "@reduxjs/toolkit"
import { UserInterfaceId } from '../../interfaces/userInterface'
import { UserArchiveRequestInterface } from "../../interfaces/api/requests/userArchiveRequestInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"


export const UserArchiveThunk = createAsyncThunk<
    UserInterfaceId,
    UserArchiveRequestInterface,
    { rejectValue: ApiErrorResponseInterface }
>(
    "user/archive",
    async ({ idUser, isArchived }, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue({
                status: 401,
                message: 'No authentication token found',
            })
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_USERS}/archive/${idUser}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
                body: JSON.stringify({ isArchived })
            })

            if (request.ok) {
                const userUpdated = await request.json()
                return userUpdated
            }
            else {
                const errorData = await request.json().catch(() => null)
                return rejectWithValue({
                    status: request.status,
                    message: errorData?.message ?? 'Error archiving user',
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