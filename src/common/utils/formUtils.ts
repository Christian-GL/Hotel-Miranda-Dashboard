
import { BookingInterface } from '../../booking/interfaces/bookingInterface.ts'
import { RoomInterface } from '../../room/interfaces/roomInterface.ts'
import { ContactInterface } from '../../contact/interfaces/contactInterface.ts'
import { UserInterface } from '../../user/interfaces/userInterface.ts'
import { RoomType } from '../../room/data/roomType.ts'
// import {BookingStatus} crear interfaz 


export const checkFirstIDAvailable = (list: BookingInterface[] | RoomInterface[] | ContactInterface[] | UserInterface[]) => {

    const sortedList = [...list].sort((a, b) => a.id - b.id)
    if (sortedList[0].id > 1) {
        return 1
    }
    for (let i = 0; i < sortedList.length - 1; i++) {
        const currentId = sortedList[i].id
        const nextId = sortedList[i + 1].id
        if (nextId - currentId > 1) {
            return currentId + 1
        }
    }

    return sortedList[sortedList.length - 1].id + 1
}

export const getActualDate = () => {
    let time = new Date()
    return time.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).replace(',', '')
}

export const getActualTime = () => {
    let time = new Date()
    return time.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).toUpperCase()
}

export const dateFormatToYYYYMMDD = (dateDDMMYYYY: string) => {
    const [day, month, year] = dateDDMMYYYY.split('/')
    return `${year}-${month}-${day}`
}

export const dateFormatToDDMMYYYY = (dateYYYYMMDD: string) => {
    const [year, month, day] = dateYYYYMMDD.split('-')
    return `${day}/${month}/${year}`
}

export const hourFormatTo12H = (time24H: string) => {
    const [hours, minutes] = time24H.split(":")
    let hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    hour = hour % 12
    hour = hour === 0 && ampm === 'AM' ? 0 : hour
    const minute = minutes
    return `${hour}:${minute} ${ampm}`
}

export const hourFormatTo24H = (time12H: string) => {
    const [hour12HFormat, period] = time12H.split(' ')
    let [hours, minutes] = hour12HFormat.split(':')
    let hoursNumber = parseInt(hours)
    if (period === 'PM' && hoursNumber < 12) {
        hoursNumber += 12
    }
    if (period === 'AM' && hoursNumber === 12) {
        hoursNumber = 0
    }
    return `${hoursNumber < 10 ? '0' + hours : hours}:${minutes}`
}


export const validateRoomPhotoArray = (photos: string[]): { test: boolean, errorMessage: string } => {
    const regex = /\.(png|jpg)$/i
    photos.map((photo, index) => {
        if (typeof photo !== "string") { return { test: false, errorMessage: `Photo ${index} url is not String` } }
    })
    photos.map((photo, index) => {
        if (!regex.test(photo)) { return { test: false, errorMessage: `Photo ${index} is not .png or .jpg file` } }
    })
    if (photos.length < 3) { return { test: false, errorMessage: 'Photos need to be at least 3' } }
    return { test: true, errorMessage: '' }
}

export const validatePhoto = (photo: string): { test: boolean, errorMessage: string } => {
    const regex = /\.(png|jpg)$/i
    if (typeof photo !== "string") { return { test: false, errorMessage: 'Photo url is not String' } }
    if (!regex.test(photo)) { return { test: false, errorMessage: 'Not .png or .jpg file' } }
    return { test: true, errorMessage: '' }
}

export const validateName = (name: string): { test: boolean, errorMessage: string } => {
    if (typeof name !== "string") { return { test: false, errorMessage: 'Name is not String' } }
    if (name.length < 3) { return { test: false, errorMessage: 'Name length must be 3 characters or more' } }
    if (name.length > 50) { return { test: false, errorMessage: 'Name length must be 50 characters or less' } }
    return { test: true, errorMessage: '' }
}

export const validateTextArea = (text: string): { test: boolean, errorMessage: string } => {
    if (typeof text !== "string") { return { test: false, errorMessage: 'Text is not String' } }
    if (text.length < 10) { return { test: false, errorMessage: 'Text length must be 10 characters or more' } }
    if (text.length > 500) { return { test: false, errorMessage: 'Text length must be 500 characters or less' } }
    return { test: true, errorMessage: '' }
}

export const validateEmail = (email: string): { test: boolean, errorMessage: string } => {
    const regex = new RegExp(/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    if (typeof email !== "string") { return { test: false, errorMessage: 'Email is not String' } }
    if (!regex.test(email)) { return { test: false, errorMessage: 'Email format no valid' } }
    return { test: true, errorMessage: '' }
}

export const validatePhoneNumber = (phoneNumber: string): { test: boolean, errorMessage: string } => {
    const regex = /^(\d{3}[-\s]?\d{3}[-\s]?\d{3,4})$/
    if (typeof phoneNumber !== "string") { return { test: false, errorMessage: 'phone number is not String' } }
    if (phoneNumber.length < 9) { return { test: false, errorMessage: 'Phone number length must be 9 characters or more' } }
    if (phoneNumber.length > 20) { return { test: false, errorMessage: 'Phone number length must be 20 characters or less' } }
    if (!regex.test(phoneNumber)) { return { test: false, errorMessage: 'Phone number only digits are available' } }
    return { test: true, errorMessage: '' }
}

export const validateDateAndTime = (data: string): { test: boolean, errorMessage: string } => {
    if (data === '') { return { test: false, errorMessage: 'Date/time is not set' } }
    if (data === undefined) { return { test: false, errorMessage: 'Some field is undefined' } }
    if (data === null) { return { test: false, errorMessage: 'Some field is null' } }
    return { test: true, errorMessage: '' }
}

export const validateRoomType = (type: string): { test: boolean, errorMessage: string } => {
    if (typeof type !== "string") { return { test: false, errorMessage: 'Room Type is not String' } }
    if (!Object.values(RoomType).includes(type as RoomType)) { return { test: false, errorMessage: 'Rome type is not set' } }
    return { test: true, errorMessage: '' }
}

export const validateRoomPrice = (price: number): { test: boolean, errorMessage: string } => {
    if (typeof price !== "number") { return { test: false, errorMessage: 'Price is not a number' } }
    if (price < 25) { return { test: false, errorMessage: 'Price must be 25$ or more' } }
    if (price > 100000) { return { test: false, errorMessage: 'Price must be 100 000$ or less' } }
    return { test: true, errorMessage: '' }
}

export const validateRoomDiscount = (discount: number): { test: boolean, errorMessage: string } => {
    if (typeof discount !== "number") { return { test: false, errorMessage: 'Discount is not a number' } }
    if (discount < 0) { return { test: false, errorMessage: 'Discount must be 0 or more' } }
    if (discount > 100) { return { test: false, errorMessage: 'Discount must be 100 or less' } }
    return { test: true, errorMessage: '' }
}

export const validateRoomNumber = (number: number): { test: boolean, errorMessage: string } => {
    if (typeof number !== "number") { return { test: false, errorMessage: 'Room number is not a number' } }
    if (number === 0) { return { test: false, errorMessage: 'Rome number is not set' } }
    return { test: true, errorMessage: '' }
}

export const validateBookingStatus = (type: string): { test: boolean, errorMessage: string } => {
    // if (typeof type !== "string") { return { test: false, errorMessage: 'Room Type is not String' } }
    // if (!Object.values(RoomType).includes(type as RoomType)) { return { test: false, errorMessage: 'Rome type is not set' } }
    // Crear interfaz de buking status
    return { test: true, errorMessage: '' }
}


// export const checkCheckOut = (checkIn, checkOut) => {
//     const currentDate = new Date()
//     if (!(checkOut instanceof Date) || isNaN(checkOut.getTime())) {
//         throw new Error('error checkOut isValidDate')
//     }
//     if (checkOut < currentDate) {
//         throw new Error('error checkOutIsPastDate')
//     }
//     if (checkOut <= checkIn) {
//         throw new Error('error checkOutIsBeforeCheckIn')
//     }
// }

// export const checkCheckIn = (checkIn) => {
//     const currentDate = new Date()
//     if (!(checkIn instanceof Date) || isNaN(checkIn.getTime())) {
//         throw new Error('error checkIn isValidDate')
//     }
//     if (checkIn < currentDate) {
//         throw new Error('error checkInIsPastDate')
//     }
// }

// export const checkPrice = (price) => {
//     if (!Number.isInteger(price)) {
//         throw new Error('error rate isInteger')
//     }
//     if (price <= 0) {
//         throw new Error('error rate isPositive')
//     }
//     const maxPrice = 100000
//     if (price > maxPrice) {
//         throw new Error('error rate isOverMaxPrice')
//     }
// }

// export const checkDiscount = (discount) => {
//     if (typeof discount !== 'number') {
//         throw new Error('error discount isNumber')
//     }
//     if (discount < 0 || discount > 100) {
//         throw new Error('error discount isOutOfRange')
//     }
// }