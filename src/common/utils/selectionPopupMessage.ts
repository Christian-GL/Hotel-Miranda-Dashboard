
import React from 'react'
import { PopupTextInterface } from '../interfaces/popupTextInterface'

export const handleSelectionPopupMessage = (
    setInfoPopup: React.Dispatch<React.SetStateAction<PopupTextInterface>>,
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>,
    onConfirm: () => void,
    onCancel: () => void
): void => {

    setInfoPopup({
        title: 'Delete confirmation',
        text: 'Are you sure you want to delete this element?',
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