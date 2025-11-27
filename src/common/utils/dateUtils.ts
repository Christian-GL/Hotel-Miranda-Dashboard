
export const formatDateForInput = (isoString: string): string => {
    if (!isoString) return ""

    const date = new Date(isoString)
    const offset = date.getTimezoneOffset() * 60000
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16)

    return localISOTime
}

// OLD VERSION:
// export const formatDateForPrint = (isoDate: string): string => {
//     const date = new Date(isoDate)

//     const day = String(date.getDate()).padStart(2, '0')
//     const month = String(date.getMonth() + 1).padStart(2, '0')
//     const year = date.getFullYear()
//     const hours = String(date.getHours()).padStart(2, '0')
//     const minutes = String(date.getMinutes()).padStart(2, '0')

//     return `${day}/${month}/${year} ${hours}:${minutes}`
// }

// TEMPORAL:
export const formatDateForPrint = (isoDate: any): any => {
    return isoDate
}