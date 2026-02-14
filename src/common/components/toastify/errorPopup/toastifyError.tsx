
import { toast } from 'react-toastify'
import { Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as toastifyErrorStyles from './toastifyErrorStyles'


export const ToastifyError = (message: string) => {
    toast.error(
        <toastifyErrorStyles.DivMessage>
            <toastifyErrorStyles.PMessage>{message}</toastifyErrorStyles.PMessage>
        </toastifyErrorStyles.DivMessage>,
        {
            position: "top-center",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0.1,
            theme: "dark",
            transition: Slide,
        }
    )
}