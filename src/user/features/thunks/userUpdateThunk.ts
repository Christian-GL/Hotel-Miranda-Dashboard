
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

export const UserUpdateThunk = createAsyncThunk
    ("user/update", async ({ idUser, updatedUserData }
        : { idUser: string, updatedUserData: UserInterface }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return userDefaultIfError

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