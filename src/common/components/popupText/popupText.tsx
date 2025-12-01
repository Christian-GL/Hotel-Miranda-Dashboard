
import React from 'react'

import * as popupTextStyles from "./popupTextStyles"


export const PopupText = ({ isSlider, title, text, onClose }) => {

    return (

        <popupTextStyles.DialogPopup isSlider={isSlider}>
            <popupTextStyles.TitleH2>{title}</popupTextStyles.TitleH2>
            <popupTextStyles.PText>{text}</popupTextStyles.PText>
            <popupTextStyles.IconClose onClick={onClose} />
        </popupTextStyles.DialogPopup>

    )
}