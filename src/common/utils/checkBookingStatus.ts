
import { BookingStatus } from "../../booking/enums/bookingStatus"


export const checkBookingStatus = (checkInDate: Date, checkOutDate: Date): BookingStatus => {
    const actualDate = new Date()
    if (actualDate < checkInDate) {
        return BookingStatus.checkIn
    }
    else if (actualDate > checkInDate && actualDate < checkOutDate) {
        return BookingStatus.inProgress
    }
    else return BookingStatus.checkOut
}