
import { BookingInterface } from "booking/interfaces/bookingInterface"


export interface BookingUpdateRequestInterface {
    idBooking: string
    updatedBookingData: BookingInterface
}