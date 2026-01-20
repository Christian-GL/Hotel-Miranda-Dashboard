
import React from "react"

type AnyState = Record<string, any>
type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export const createFormHandlers = <T extends AnyState>(setState: SetState<T>) => {

    const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setState(prev => ({ ...prev, [name]: value } as T))
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (!value) return
        const date = new Date(value)
        setState(prev => ({ ...prev, [name]: date } as T))
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target
        if (files && files[0]) {
            const photoUrl = URL.createObjectURL(files[0])
            setState(prev => ({ ...prev, [name]: photoUrl } as T))
        }
    }

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setState(prev => ({ ...prev, [name]: value } as T))
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setState(prev => ({ ...prev, [name]: value } as T))
    }

    const handleSelectAppendToArray = <K extends keyof T>(field: K) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        if (value === 'null') return

        setState(prev => {
            const prevArr = Array.isArray(prev[field])
                ? (prev[field] as string[])
                : []

            if (prevArr.includes(value)) return prev
            return {
                ...prev,
                [field]: [...prevArr, value]
            }
        })
    }

    const handleArrayPhotosChange = (index: number, field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target
        if (files && files[0]) {
            const photoUrl = URL.createObjectURL(files[0])

            setState(prev => {
                const arr = Array.isArray(prev[field]) ? [...prev[field]] : []
                arr[index] = photoUrl
                return { ...prev, [field]: arr } as T
            })
        }
    }

    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, options } = e.target
        const selectedValues: string[] = []

        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedValues.push(options[i].value)
            }
        }

        setState(prev => ({
            ...prev,
            [name]: selectedValues
        } as T))
    }

    const handleNumberFloatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setState(prev => ({
            ...prev,
            [name]: value === "" ? 0 : parseFloat(value)
        } as T))
    }

    return {
        handleStringChange,
        handleDateChange,
        handlePhotoChange,
        handleTextAreaChange,
        handleSelectChange,
        handleSelectAppendToArray,
        handleArrayPhotosChange,
        handleMultiSelectChange,
        handleNumberFloatChange
    }
}