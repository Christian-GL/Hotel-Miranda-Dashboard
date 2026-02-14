
import { toast } from 'react-toastify'
import { ToastTransitionProps } from 'react-toastify'
import { Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as toastifyLoadingStyles from './toastifyLoadingStyles'


const NoTransition = ({ children }: ToastTransitionProps) => {
    return <>{children}</>
}

export const ToastifyLoading = (id: number, message: string) => {
    toast(
        <toastifyLoadingStyles.DivMessage>
            <toastifyLoadingStyles.GlobalToastStyles />
            <toastifyLoadingStyles.Spinner />
            <toastifyLoadingStyles.PMessage>{message}</toastifyLoadingStyles.PMessage>
        </toastifyLoadingStyles.DivMessage>,
        {
            toastId: id,
            position: "top-center",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: false,
            closeButton: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
            transition: Zoom
            // transition: NoTransition
        }
    )
}