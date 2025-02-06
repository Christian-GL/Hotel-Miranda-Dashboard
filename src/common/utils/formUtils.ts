
import { BookingInterface } from '../../booking/interfaces/bookingInterface'
import { RoomInterface } from '../../room/interfaces/roomInterface'
import { ContactInterface } from '../../contact/interfaces/contactInterface'
import { UserInterface } from '../../user/interfaces/userInterface'


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


// export const checkName = (name) => {
//     if (typeof name !== "string") {
//         throw new Error('error name isString')
//     }
//     if (name.length <= 2) {
//         throw new Error('error name isMinLenght')
//     }
//     if (name.length >= 100) {
//         throw new Error('error name isMaxLenght')
//     }
// }

// export const checkEmail = (email) => {
//     const regex = new RegExp(/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
//     if (typeof email !== "string") {
//         throw new Error('error email isString')
//     }
//     if (email.length <= 2) {
//         throw new Error('error email isMinLenght')
//     }
//     if (email.length >= 100) {
//         throw new Error('error email isMaxLenght')
//     }
//     if (!regex.test(email)) {
//         throw new Error("error email isCorrectFormat")
//     }
// }

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