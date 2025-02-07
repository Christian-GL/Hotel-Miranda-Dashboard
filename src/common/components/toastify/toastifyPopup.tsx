
import React from 'react'
import { toast } from 'react-toastify'
import { Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as toastifyStyles from './toastifyStyles.ts'


export const ToastifyPopup = () => {
    toast(
        <toastifyStyles.DivMessage>
            <toastifyStyles.GlobalToastStyles />
            <toastifyStyles.Spinner />
            <toastifyStyles.PMessage>Loading Data...</toastifyStyles.PMessage>
        </toastifyStyles.DivMessage>,
        {
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

