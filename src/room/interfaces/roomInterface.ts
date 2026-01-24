
import { RoomType } from "../enums/roomType"
import { RoomAmenities } from '../enums/roomAmenities'
import { OptionYesNo } from "common/enums/optionYesNo"


export interface RoomInterface {
    number: string
    photos: string[]
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    isActive: OptionYesNo
    isArchived: OptionYesNo
    booking_id_list: string[]
}

export interface RoomInterfaceId extends RoomInterface {
    _id: string
}