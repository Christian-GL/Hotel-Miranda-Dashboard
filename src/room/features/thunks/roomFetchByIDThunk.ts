
import { createAsyncThunk } from "@reduxjs/toolkit"
import { RoomInterface } from "../../interfaces/roomInterface"
import { RoomType } from "../../enums/roomType"
import { OptionYesNo } from "common/enums/optionYesNo"


const roomDefaultIfError: RoomInterface = {
    _id: '0',
    photos: [],
    number: '0',
    type: RoomType.singleBed,
    amenities: [],
    price: 0,
    discount: 0,
    isActive: OptionYesNo.no,
    isArchived: OptionYesNo.yes,
    booking_id_list: []
}

export const RoomFetchByIDThunk = createAsyncThunk
    ("room/fetchById", async (roomId: string) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return roomDefaultIfError

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_ROOMS}/${roomId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                }
            })
            if (request.ok) {
                const json = await request.json()
                let room: RoomInterface = {
                    _id: json._id,
                    photos: json.photo,
                    number: json.number,
                    type: json.type,
                    amenities: json.amenities,
                    price: json.price,
                    discount: json.discount,
                    isActive: json.isActive,
                    isArchived: json.isArchived,
                    booking_id_list: json.booking_id_list
                }
                return room
            }
            else {
                console.error('Error: ', request.statusText)
                return roomDefaultIfError
            }
        }
        catch (error) {
            console.error(error)
            return roomDefaultIfError
        }

    })