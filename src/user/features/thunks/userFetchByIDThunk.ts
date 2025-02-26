
import { createAsyncThunk } from "@reduxjs/toolkit"
import { UserInterface } from '../../interfaces/userInterface.ts'
import { UserStatus } from "../../data/userStatus.ts"


const userDefaultIfError: UserInterface = {
    _id: '',
    photo: '',
    full_name: '',
    email: '',
    password: '',
    start_date: '',
    description: '',
    phone_number: '',
    status: UserStatus.inactive
}

export const UserFetchByIDThunk = createAsyncThunk
    ("user/fetchById", async (userId: string) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return userDefaultIfError

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
                let user: UserInterface = {
                    _id: json._id,
                    photo: json.photo,
                    full_name: json.full_name,
                    email: json.email,
                    password: json.password,
                    start_date: json.start_date,
                    description: json.description,
                    phone_number: json.phone_number,
                    status: json.status
                }
                return user
            }
            else {
                console.log('Error: ', request.statusText)
                return userDefaultIfError
            }
        }
        catch (error) {
            console.log(error)
            return userDefaultIfError
        }

    })