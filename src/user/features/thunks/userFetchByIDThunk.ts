
import { createAsyncThunk } from "@reduxjs/toolkit"
import { UserInterface } from '../../interfaces/userInterface.ts'
import { JobPosition } from "../../enums/jobPosition.ts"
import { Role } from "../../enums/role.ts"
import { OptionYesNo } from "../../../common/enums/optionYesNo.ts"


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
                    phone_number: json.phone_number,
                    start_date: json.start_date,
                    end_date: json.end_date,
                    job_position: json.job_position,
                    role: json.role,
                    password: json.password,
                    isArchived: json.isArchived
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