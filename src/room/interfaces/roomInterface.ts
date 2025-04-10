
import { RoomType } from "../enums/roomType.ts"
import { RoomAmenities } from '../enums/roomAmenities.ts'
import { BookingInterface } from "../../booking/interfaces/bookingInterface.ts"


export interface RoomInterfaceNoId {
    photos: string[]
    number: string
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
}
export interface RoomInterface extends RoomInterfaceNoId {
    _id: number
}

export interface RoomInterfaceBookingsDataNoId {
    photos: string[]
    number: string
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    booking_data_list: BookingInterface[]
}
export interface RoomInterfaceBookings extends RoomInterfaceBookingsDataNoId {
    _id: number
}