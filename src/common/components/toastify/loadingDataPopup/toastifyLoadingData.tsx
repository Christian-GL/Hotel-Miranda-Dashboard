
import React from 'react'
import { toast } from 'react-toastify'
import { ToastTransitionProps } from 'react-toastify';
import { Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as toastifyLoadingDataStyles from './toastifyLoadingDataStyles.ts'


const NoTransition = ({ children }: ToastTransitionProps) => {
    return <>{children}</>
}

export const ToastifyLoadingData = (id: number, message: string) => {
    toast(
        <toastifyLoadingDataStyles.DivMessage>
            <toastifyLoadingDataStyles.GlobalToastStyles />
            <toastifyLoadingDataStyles.Spinner />
            <toastifyLoadingDataStyles.PMessage>{message}</toastifyLoadingDataStyles.PMessage>
        </toastifyLoadingDataStyles.DivMessage>,
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