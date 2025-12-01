
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

    return {
        handleStringChange,
        handleDateChange,
        handlePhotoChange,
        handleTextAreaChange,
        handleSelectChange
    }
}