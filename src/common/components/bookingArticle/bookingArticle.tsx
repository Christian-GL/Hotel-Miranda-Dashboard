
import React from 'react'
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import * as styles from "./bookingArticleStyles"
import { BookingArticleInterface } from "../../interfaces/bookingArticleInterface"
import { IconHotel } from '../layout/sidebarMenuStyles'
import { PopupText } from "../popupText/popupText"
import { BookingStatus } from '../../../booking/enums/bookingStatus'


export const BookingArticle: React.FC<BookingArticleInterface> = ({
    bookingStatus,
    nameClient,
    roomNumbersText,
    orderDateText,
    specialRequest,
    navigationRoute
}) => {

    const navigate = useNavigate()
    const [showPopup, setShowPopup] = useState<boolean>(false)

    return (<>

        {showPopup && <PopupText isSlider={true} title={nameClient} text={specialRequest} onClose={() => setShowPopup(false)} />}

        <styles.BookingArticle>
            <styles.TextCheckingStatus status={bookingStatus}>{bookingStatus}</styles.TextCheckingStatus>

            <styles.TextSpecialRequest onClick={() => { setShowPopup(true) }}>{specialRequest}</styles.TextSpecialRequest>

            <styles.CtnDetails>
                <styles.CtnLeft>
                    <IconHotel isCursorPointer={false} />
                    <styles.CtnInfo>
                        <styles.TitleNameClient>{nameClient}</styles.TitleNameClient>
                        <styles.TitleDate>{roomNumbersText}</styles.TitleDate>
                        <styles.TitleDate>{orderDateText}</styles.TitleDate>
                    </styles.CtnInfo>
                </styles.CtnLeft>

                <styles.CtnRight>
                    <styles.ButtonNavigation onClick={() => { navigate(navigationRoute) }}>+ INFO</styles.ButtonNavigation>
                </styles.CtnRight>
            </styles.CtnDetails>
        </styles.BookingArticle>

    </>)
}