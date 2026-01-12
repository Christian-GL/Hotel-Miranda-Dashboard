
import { createAsyncThunk } from "@reduxjs/toolkit"
import { UserInterface } from '../../interfaces/userInterface'


export const UserFetchAllThunk = createAsyncThunk<
    UserInterface[],
    void,
    { rejectValue: string }
>(
    "user/fetchAll",
    async (_, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue('No authentication token found')
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_USERS}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                }
            })
            if (request.ok) {
                const json = await request.json()
                let allUsers: UserInterface[] = []
                for (let i = 0; i < json.length; i++) {
                    allUsers.push({
                        _id: json[i]._id,
                        photo: json[i].photo,
                        full_name: json[i].full_name,
                        email: json[i].email,
                        phone_number: json[i].phone_number,
                        start_date: json[i].start_date,
                        end_date: json[i].end_date,
                        job_position: json[i].job_position,
                        role: json[i].role,
                        password: json[i].password,
                        isArchived: json[i].isArchived
                    })
                }
                return allUsers
            }
            else {
                const errorData = await request.json()
                return rejectWithValue(errorData.message || 'Failed to fetch users')
            }
        }
        catch (error) {
            return rejectWithValue('Network or server error')
        }

    })