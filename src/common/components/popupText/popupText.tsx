
import * as styles from "common/components/popupText/popupTextStyles"
import { PopupTextInterface } from "common/interfaces/popupTextInterface"


export const PopupText = ({
    title,
    text,
    isSlider,
    onConfirm,
    onCancel,
    onClose
}: PopupTextInterface) => {

    return (
        <styles.DialogPopup isSlider={isSlider}>
            <styles.TitleH2>{title}</styles.TitleH2>
            <styles.Text>{text}</styles.Text>

            {onConfirm && onCancel
                ? <styles.CtnButtonChoice>
                    <styles.ButtonChoice isYes={false} onClick={() => { onCancel?.() }}>
                        No
                    </styles.ButtonChoice>
                    <styles.ButtonChoice isYes={true} onClick={() => { onConfirm?.() }} >
                        Yes
                    </styles.ButtonChoice>
                </styles.CtnButtonChoice>
                : <></>
            }

            <styles.IconClose onClick={onClose} />
        </styles.DialogPopup>
    )
}