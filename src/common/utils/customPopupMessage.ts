
import { PopupTextInterface } from "common/interfaces/popupTextInterface"


export const customPopupMessage = (
    setInfoPopup: React.Dispatch<React.SetStateAction<PopupTextInterface>>,
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    text: string
) => {
    setInfoPopup({ title, text })
    setShowPopup(true)
}
