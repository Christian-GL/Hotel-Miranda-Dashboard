
import * as articleReviewJS from "./articleReview.js"


export const ArticleReview = (props) => {

    return (<>

        <articleReviewJS.ArticleReview>
            <articleReviewJS.PTextReview>
                {props.textreview}
            </articleReviewJS.PTextReview>
            <articleReviewJS.DivCtnDetails>
                <articleReviewJS.DivCtnReviewDetails>
                    <articleReviewJS.ImgProfile src="src/common/assets/img/PedroSanchez.png" />
                    <articleReviewJS.DivCtnInfoDetails>
                        <articleReviewJS.TitleNameProfile>{props.nameprofile}</articleReviewJS.TitleNameProfile>
                        <articleReviewJS.TextH5>{props.timesince} ago</articleReviewJS.TextH5>
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