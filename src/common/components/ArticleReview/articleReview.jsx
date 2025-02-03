
import { useState } from "react"

import * as articleReviewJS from "./articleReview.js"
import PedroSanchez from '../../../assets/img/PedroSanchez.png'
import { PopupText } from "../popupText/popupText.jsx"


export const ArticleReview = (props) => {

    const [showPopup, setShowPopup] = useState(false)

    const openPopup = () => {
        setShowPopup(true)
    }

    return (<>

        {showPopup && <PopupText title={props.nameprofile} text={props.textreview} onClose={() => setShowPopup(false)} />}

        <articleReviewJS.ArticleReview>
            <articleReviewJS.PTextReview onClick={openPopup}>
                {props.textreview}
            </articleReviewJS.PTextReview>

            <articleReviewJS.DivCtnDetails>

                <articleReviewJS.DivCtnReviewDetails>
                    <articleReviewJS.ImgProfile src={PedroSanchez} />
                    <articleReviewJS.DivCtnInfoDetails>
                        <articleReviewJS.TitleNameProfile>{props.nameprofile}</articleReviewJS.TitleNameProfile>
                        <articleReviewJS.TextH5>{props.timesince}</articleReviewJS.TextH5>
                    </articleReviewJS.DivCtnInfoDetails>
                </articleReviewJS.DivCtnReviewDetails>

                <articleReviewJS.DivCtnIcons>
                    <articleReviewJS.IconCheckConfirm />
                    <articleReviewJS.IconCheckCross />
                </articleReviewJS.DivCtnIcons>

            </articleReviewJS.DivCtnDetails>
        </articleReviewJS.ArticleReview>

    </>)
}