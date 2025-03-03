
export const formatDateForInput = (isoString: string): string => {
    if (!isoString) return ""

    const date = new Date(isoString)
    const offset = date.getTimezoneOffset() * 60000
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16)

    return localISOTime
}

export const formatDateForPrint = (isoDate: string): string => {
    const date = new Date(isoDate)

    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = date.getUTCFullYear()
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
}