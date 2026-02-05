
import React from 'react'
import { PopupTextInterface } from '../interfaces/popupTextInterface'

export const handleSelectionPopupMessage = (
    setInfoPopup: React.Dispatch<React.SetStateAction<PopupTextInterface>>,
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    text: string,
    onConfirm: () => void,
    onCancel: () => void
): void => {

    setInfoPopup({
        title: title,
        text: text,
        onConfirm: () => {
            onConfirm()
            setShowPopup(false)
        },
        onCancel: () => {
            onCancel()
            setShowPopup(false)
        },
        onClose: () => setShowPopup(false),
    })
    setShowPopup(true)
}