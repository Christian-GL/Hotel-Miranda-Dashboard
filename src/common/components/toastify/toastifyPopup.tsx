
import React from 'react'
import { toast } from 'react-toastify'
import { Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as toastifyStyles from './toastifyStyles.ts'


export const ToastifyPopup = (id: number, message: string) => {
    toast(
        <toastifyStyles.DivMessage>
            <toastifyStyles.GlobalToastStyles />
            <toastifyStyles.Spinner />
            <toastifyStyles.PMessage>{message}</toastifyStyles.PMessage>
        </toastifyStyles.DivMessage>,
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
        }
    )
}