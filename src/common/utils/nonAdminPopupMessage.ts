
import { PopupTextInterface } from "common/interfaces/popupTextInterface"


export const handleNonAdminClick = (
    setInfoPopup: React.Dispatch<React.SetStateAction<PopupTextInterface>>,
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setInfoPopup({
        title: 'Access denied',
        text: 'You need administrator privileges to perform this operation'
    })
    setShowPopup(true)
}