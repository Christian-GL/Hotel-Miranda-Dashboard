
import * as popupTextStyles from "./popupTextStyles"
import { PopupTextInterface } from "../../interfaces/popupTextInterface"


export const PopupText = ({ isSlider, title, text, onClose }: PopupTextInterface) => {
    return (
        <popupTextStyles.DialogPopup isSlider={isSlider}>
            <popupTextStyles.TitleH2>{title}</popupTextStyles.TitleH2>
            <popupTextStyles.PText>{text}</popupTextStyles.PText>
            <popupTextStyles.IconClose onClick={onClose} />
        </popupTextStyles.DialogPopup>
    )
}