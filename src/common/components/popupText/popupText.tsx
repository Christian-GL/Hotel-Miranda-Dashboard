
import React from 'react'

import * as popupTextStyles from "./popupTextStyles.ts"


export const PopupText = ({ title, text, onClose }) => {


    return (

        <popupTextStyles.DialogPopup>
            <popupTextStyles.TitleH2>{title}</popupTextStyles.TitleH2>
            <popupTextStyles.PText>{text}</popupTextStyles.PText>
            <popupTextStyles.IconClose onClick={onClose} />
        </popupTextStyles.DialogPopup>

    )
}