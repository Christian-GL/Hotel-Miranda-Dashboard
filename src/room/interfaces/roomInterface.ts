
import { RoomType } from "../enums/roomType"
import { RoomAmenities } from '../enums/roomAmenities'
import { BookingInterface } from "../../booking/interfaces/bookingInterface"
import { OptionYesNo } from "common/enums/optionYesNo"


export interface RoomInterfacePriceAndDiscount {
    price: number
    discount: number
}

export interface RoomInterfaceNoId extends RoomInterfacePriceAndDiscount {
    number: string
    photos: string[]
    type: RoomType
    amenities: RoomAmenities[]
    // price: number
    // discount: number
    isActive: OptionYesNo
    isArchived: OptionYesNo
    booking_id_list: string[]
}

export interface RoomInterface extends RoomInterfaceNoId {
    _id: string
}

// !!! ACTUALIZAR:
export interface RoomInterfaceBookingsDataNoId {
    number: string
    photos: string[]
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    isActive: OptionYesNo
    isArchived: OptionYesNo
    booking_data_list: BookingInterface[]
}

export interface RoomInterfaceBookings extends RoomInterfaceBookingsDataNoId {
    _id: string
}