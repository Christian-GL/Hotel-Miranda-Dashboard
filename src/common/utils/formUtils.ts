
import { BookingInterface } from '../../booking/interfaces/bookingInterface.ts'
import { RoomInterface } from '../../room/interfaces/roomInterface.ts'
import { ContactInterface } from '../../contact/interfaces/contactInterface.ts'
import { UserInterface } from '../../user/interfaces/userInterface.ts'
import { RoomType } from '../../room/data/roomType.ts'
import { BookingStatus } from '../../booking/data/bookingStatus.ts'


export const checkFirstIDAvailable = (list: number[]) => {

    const sortedList = [...list].sort((a, b) => a - b)
    if (sortedList[0] > 1) {
        return 1
    }
    for (let i = 0; i < sortedList.length - 1; i++) {
        const currentId = sortedList[i]
        const nextId = sortedList[i + 1]
        if (nextId - currentId > 1) {
            return currentId + 1
        }
    }

    return sortedList[sortedList.length - 1] + 1
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
    hour = hour === 0 ? 12 : hour
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
    return `${hoursNumber < 10 ? '0' + hoursNumber : hoursNumber}:${minutes}`
}



export const validateRoomPhotoArray = (photos: string[]): { test: boolean, errorMessages: string[] } => {
    let test: boolean = true
    const errorMessages: string[] = []
    const regex = /\.(png|jpg)$/i

    photos.forEach((photo, index) => {
        if (typeof photo !== "string") {
            test = false
            errorMessages.push(`Photo ${index} url is not a String`)
        }
        if (!regex.test(photo)) {
            test = false
            errorMessages.push(`Photo ${index} is not .png or .jpg file`)
        }
    })

    if (photos[0] === undefined) {
        test = false
        errorMessages.push('Main photo need to be set')
    }
    if (photos.length < 3) {
        test = false
        errorMessages.push('Photos need to be at least 3')
    }

    return { test, errorMessages }
}

export const validatePhoto = (photo: string): { test: boolean, errorMessages: string[] } => {
    let test: boolean = true
    const errorMessages: string[] = []
    const regex = /\.(png|jpg)$/i

    if (typeof photo !== "string") {
        test = false
        errorMessages.push('Photo url is not a String')
    }
    if (!regex.test(photo)) {
        test = false
        errorMessages.push('Not .png or .jpg file')
    }

    return { test, errorMessages }
}

export const validateName = (name: string): { test: boolean, errorMessages: string[] } => {
    let test: boolean = true
    const errorMessages: string[] = []
    const regex = new RegExp(/^[^\d]*$/)

    if (typeof name !== "string") {
        test = false
        errorMessages.push('Name is not a String')
    }
    if (name.length < 3) {
        test = false
        errorMessages.push('Name length must be 3 characters or more')
    }
    if (name.length > 50) {
        test = false
        errorMessages.push('Name length must be 50 characters or less')
    }
    if (!regex.test(name)) {
        test = false
        errorMessages.push('Name must not contain numbers')
    }

    return { test, errorMessages }
}

export const validateTextArea = (text: string): { test: boolean, errorMessages: string[] } => {
    let test: boolean = true
    const errorMessages: string[] = []

    if (typeof text !== "string") {
        test = false
        errorMessages.push('Text is not a String')
    }
    if (text.length < 10) {
        test = false
        errorMessages.push('Text length must be 10 characters or more')
    }
    if (text.length > 500) {
        test = false
        errorMessages.push('Text length must be 500 characters or less')
    }

    return { test, errorMessages }
}

export const validateEmail = (email: string): { test: boolean, errorMessages: string[] } => {
    let test: boolean = true
    const errorMessages: string[] = []
    const regex = new RegExp(/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

    if (typeof email !== "string") {
        test = false
        errorMessages.push('Email is not a String')
    }
    if (!regex.test(email)) {
        test = false
        errorMessages.push('Email format no valid')
    }

    return { test, errorMessages }
}

export const validatePassword = (password: string): { test: boolean, errorMessages: string[] } => {
    let test: boolean = true
    const errorMessages: string[] = []
    const regexUppercase = /[A-Z]/
    const regexNumber = /\d/
    const regexSymbols = /[*\-.,!@#$%^&*()_+={}|\[\]:;"'<>,.?/~`]/

    if (password.length < 8 || password.length > 20) {
        test = false
        errorMessages.push('Password length must be between 8 and 20 characters')
    }
    if (!regexUppercase.test(password)) {
        test = false
        errorMessages.push('Password must contain at least one uppercase letter')
    }
    if (!regexNumber.test(password)) {
        test = false
        errorMessages.push('Password must contain at least one number')
    }
    if (!regexSymbols.test(password)) {
        test = false
        errorMessages.push('Password must contain at least one symbol (*, -, ., etc)')
    }

    return { test, errorMessages }
}


export const validatePhoneNumber = (phoneNumber: string): { test: boolean, errorMessages: string[] } => {
    let test: boolean = true
    const errorMessages: string[] = []
    const regex = /^(\d{3}[-\s]?\d{3}[-\s]?\d{3,4})$/

    if (typeof phoneNumber !== "string") {
        test = false
        errorMessages.push('Phone number is not a String')
    }
    if (phoneNumber.length < 9) {
        test = false
        errorMessages.push('Phone number length must be 9 characters or more')
    }
    if (phoneNumber.length > 20) {
        test = false
        errorMessages.push('Phone number length must be 20 characters or less')
    }
    if (!regex.test(phoneNumber)) {
        test = false
        errorMessages.push('Phone number only digits are available')
    }

    return { test, errorMessages }
}

export const validateDateAndTime = (data: string): { test: boolean, errorMessages: string[] } => {
    let test: boolean = true
    const errorMessages: string[] = []

    if (data === '') {
        test = false
        errorMessages.push('Date/time is not set')
    }
    if (data === undefined) {
        test = false
        errorMessages.push('Some field is undefined')
    }
    if (data === null) {
        test = false
        errorMessages.push('Some field is null')
    }

    return { test, errorMessages }
}

export const validateRoomType = (type: string): { test: boolean, errorMessages: string[] } => {
    let test: boolean = true
    const errorMessages: string[] = []

    if (typeof type !== "string") {
        test = false
        errorMessages.push('Room Type is not a String')
    }
    if (!Object.values(RoomType).includes(type as RoomType)) {
        test = false
        errorMessages.push('Room type is not set')
    }

    return { test, errorMessages }
}

export const validateRoomPrice = (price: number): { test: boolean, errorMessages: string[] } => {
    let test: boolean = true
    const errorMessages: string[] = []

    if (typeof price !== "number") {
        test = false
        errorMessages.push('Price is not a number')
    }
    if (price < 25) {
        test = false
        errorMessages.push('Price must be 25$ or more')
    }
    if (price > 100000) {
        test = false
        errorMessages.push('Price must be 100 000$ or less')
    }

    return { test, errorMessages }
}

export const validateRoomDiscount = (discount: number): { test: boolean, errorMessages: string[] } => {
    let test: boolean = true
    const errorMessages: string[] = []

    if (typeof discount !== "number") {
        test = false
        errorMessages.push('Discount is not a number')
    }
    if (discount < 0) {
        test = false
        errorMessages.push('Discount must be 0 or more')
    }
    if (discount > 100) {
        test = false
        errorMessages.push('Discount must be 100 or less')
    }

    return { test, errorMessages }
}

export const validateRoomNumber = (number: number): { test: boolean, errorMessages: string[] } => {
    let test: boolean = true
    const errorMessages: string[] = []

    if (typeof number !== "number") {
        test = false
        errorMessages.push('Room number is not a number')
    }
    if (number === 0) {
        test = false
        errorMessages.push('Room number is not set')
    }

    return { test, errorMessages }
}

export const validateBookingStatus = (type: string): { test: boolean, errorMessages: string[] } => {
    let test: boolean = true
    const errorMessages: string[] = []

    if (typeof type !== "string") {
        test = false
        errorMessages.push('Booking Status is not a String')
    }
    if (!Object.values(BookingStatus).includes(type as BookingStatus)) {
        test = false
        errorMessages.push('Booking Status is not set')
    }

    return { test, errorMessages }
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