
import { createAsyncThunk } from "@reduxjs/toolkit"
import { UserInterface } from '../../interfaces/userInterface.ts'
import { UserStatus } from "../../enums/userStatus.ts"


const userDefaultIfError: UserInterface = {
    _id: "0",
    photo: '',
    full_name: '',
    email: '',
    password: '',
    start_date: '',
    description: '',
    phone_number: '',
    status: UserStatus.inactive
}

export const UserFetchAllThunk = createAsyncThunk
    ("user/fetchAll", async () => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return [userDefaultIfError]

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
                        password: json[i].password,
                        start_date: json[i].start_date,
                        description: json[i].description,
                        phone_number: json[i].phone_number,
                        status: json[i].status
                    })
                }
                return allUsers
            }
            else {
                console.error('Error: ', request.statusText)
                return [userDefaultIfError]
            }
        }
        catch (error) {
            console.error(error)
            return [userDefaultIfError]
        }

    })