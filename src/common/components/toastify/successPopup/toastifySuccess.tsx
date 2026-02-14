
import { toast } from 'react-toastify'
import { Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as toastifySuccessStyles from './toastifySuccessStyles'


export const ToastifySuccess = (message: string, onClose: () => void) => {
    toast.success(
        <toastifySuccessStyles.DivMessage>
            <toastifySuccessStyles.PMessage>{message}</toastifySuccessStyles.PMessage>
        </toastifySuccessStyles.DivMessage>,
        {
            position: "top-center",
            autoClose: 1000,
            onClose: onClose,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Slide,
        }
    )
}