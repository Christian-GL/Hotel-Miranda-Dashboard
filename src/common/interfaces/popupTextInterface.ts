
export interface PopupTextInterface {
    title: string
    text: string
    isSlider?: boolean
    onConfirm?: () => void
    onCancel?: () => void
    onClose?: () => void
}