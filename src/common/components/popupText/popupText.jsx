
import * as popupTextJS from "./popupText.js"


export const PopupText = ({ title, text, onClose }) => {


    return (

        <popupTextJS.DialogPopup>
            <popupTextJS.TitleH2>{title}</popupTextJS.TitleH2>
            <popupTextJS.PText>{text}</popupTextJS.PText>
            <popupTextJS.IconClose onClick={onClose} />
        </popupTextJS.DialogPopup>

    )
}