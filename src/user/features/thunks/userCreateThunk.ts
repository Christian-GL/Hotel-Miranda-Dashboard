
import { createAsyncThunk } from "@reduxjs/toolkit"
import { UserInterfaceNoId } from '../../interfaces/userInterface.ts'
import { UserStatus } from "../../data/userStatus.ts"


const userDefaultIfError: UserInterfaceNoId = {
    photo: '',
    full_name: '',
    email: '',
    password: '',
    start_date: '',
    description: '',
    phone_number: '',
    status: UserStatus.inactive
}


export const UserCreateThunk = createAsyncThunk
    ("user/create", async (newUserData: UserInterfaceNoId) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return userDefaultIfError

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
            } else {
                console.log("Error: ", request.statusText)
                return userDefaultIfError
            }
        }
        catch (error) {
            console.log(error)
            return userDefaultIfError
        }

    })