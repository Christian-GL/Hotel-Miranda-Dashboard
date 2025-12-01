
import { createAsyncThunk } from "@reduxjs/toolkit"
import { UserInterface } from '../../interfaces/userInterface'
import { JobPosition } from "../../enums/jobPosition"
import { Role } from "../../enums/role"
import { OptionYesNo } from "../../../common/enums/optionYesNo"


const userDefaultIfError: UserInterface = {
    _id: "0",
    photo: '',
    full_name: '',
    email: '',
    phone_number: '',
    start_date: new Date(),
    end_date: new Date(),
    job_position: JobPosition.receptionist,
    role: Role.user,
    password: '1234',
    isArchived: OptionYesNo.yes
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