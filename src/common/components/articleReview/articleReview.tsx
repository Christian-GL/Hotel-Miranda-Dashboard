
import React from 'react'
import { useState } from "react"

import * as articleReviewStyles from "./articleReviewStyles"
import { ArticleReviewInterface } from "../../interfaces/articleReviewInterface"
import { IconHotel } from '../layout/sidebarMenuStyles'
import { PopupText } from "../popupText/popupText"


export const ArticleReview: React.FC<ArticleReviewInterface> = ({ title, subTittle, content }) => {

    const [showPopup, setShowPopup] = useState<boolean>(false)

    const openPopup = () => {
        setShowPopup(true)
    }

    return (<>

        {showPopup && <PopupText isSlider={true} title={title} text={content} onClose={() => setShowPopup(false)} />}

        {/* !!! REPASAR PROPORCIONES PARA QUE NO SE DESCUADREN LOS DATOS */}
        <articleReviewStyles.ArticleReview>
            <articleReviewStyles.PTextReview onClick={openPopup}>
                {content}
            </articleReviewStyles.PTextReview>

            <articleReviewStyles.DivCtnDetails>

                <articleReviewStyles.DivCtnReviewDetails>
                    <IconHotel />
                    <articleReviewStyles.DivCtnInfoDetails>
                        <articleReviewStyles.TitleNameProfile>{title}</articleReviewStyles.TitleNameProfile>
                        <articleReviewStyles.TextH5>{subTittle}</articleReviewStyles.TextH5>
                    </articleReviewStyles.DivCtnInfoDetails>
                </articleReviewStyles.DivCtnReviewDetails>

                <articleReviewStyles.DivCtnIcons>
                    <articleReviewStyles.IconCheckConfirm />
                    <articleReviewStyles.IconCheckCross />
                </articleReviewStyles.DivCtnIcons>

            </articleReviewStyles.DivCtnDetails>
        </articleReviewStyles.ArticleReview>

    </>)
}