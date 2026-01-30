
import React from 'react'
import { useState } from "react"

import * as styles from "./articleReviewStyles"
import { ArticleReviewInterface } from "../../interfaces/articleReviewInterface"
import { IconHotel } from '../layout/sidebarMenuStyles'
import { PopupText } from "../popupText/popupText"


export const ArticleReview: React.FC<ArticleReviewInterface> = ({
    title,
    firstSubtitle,
    secondSubtitle,
    content
}) => {

    const [showPopup, setShowPopup] = useState<boolean>(false)

    const openPopup = () => {
        setShowPopup(true)
    }

    return (<>

        {showPopup && <PopupText isSlider={true} title={title} text={content} onClose={() => setShowPopup(false)} />}

        {/* !!! REPASAR PROPORCIONES PARA QUE NO SE DESCUADREN LOS DATOS */}
        <styles.ArticleReview>
            <styles.PTextReview onClick={openPopup}>
                {content}
            </styles.PTextReview>

            <styles.DivCtnDetails>
                <styles.DivCtnReviewDetails>
                    <IconHotel isCursorPointer={false} />
                    <styles.DivCtnInfoDetails>
                        <styles.TitleNameProfile>{title}</styles.TitleNameProfile>
                        <styles.TextH5>{firstSubtitle}</styles.TextH5>
                        <styles.TextH5>{secondSubtitle}</styles.TextH5>
                    </styles.DivCtnInfoDetails>
                </styles.DivCtnReviewDetails>

                {/* !!! DARLE USO O ELIMINARLO DEFINITIVAMENTE: */}
                {/* <styles.DivCtnIcons>
                    <styles.IconCheckConfirm />
                    <styles.IconCheckCross />
                </styles.DivCtnIcons> */}

            </styles.DivCtnDetails>
        </styles.ArticleReview>

    </>)
}