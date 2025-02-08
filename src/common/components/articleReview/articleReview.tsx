
import React from 'react'
import { useState } from "react"

import * as articleReviewStyles from "./articleReviewStyles.ts"
import { ArticleReviewInterface } from "./articleReviewInterface.ts"
import PedroSanchez from '../../../assets/img/PedroSanchez.png'
import { PopupText } from "../popupText/popupText.tsx"


export const ArticleReview: React.FC<ArticleReviewInterface> = ({ nameProfile, textReview, timeSince }) => {

    const [showPopup, setShowPopup] = useState<boolean>(false)

    const openPopup = () => {
        setShowPopup(true)
    }

    return (<>

        {showPopup && <PopupText isSlider={true} title={nameProfile} text={textReview} onClose={() => setShowPopup(false)} />}

        <articleReviewStyles.ArticleReview>
            <articleReviewStyles.PTextReview onClick={openPopup}>
                {textReview}
            </articleReviewStyles.PTextReview>

            <articleReviewStyles.DivCtnDetails>

                <articleReviewStyles.DivCtnReviewDetails>
                    <articleReviewStyles.ImgProfile src={PedroSanchez} />
                    <articleReviewStyles.DivCtnInfoDetails>
                        <articleReviewStyles.TitleNameProfile>{nameProfile}</articleReviewStyles.TitleNameProfile>
                        <articleReviewStyles.TextH5>{timeSince}</articleReviewStyles.TextH5>
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