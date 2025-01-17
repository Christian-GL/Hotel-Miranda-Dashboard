
import * as ar from "./articleReview.js"


export const ArticleReview = (props) => {

    return (<>

        <ar.ArticleReview>
            <ar.PTextReview>
                {props.textreview}
            </ar.PTextReview>
            <ar.DivCtnDetails>
                <ar.DivCtnReviewDetails>
                    <ar.ImgProfile src="src\common\media\img\PedroSanchez.png" />
                    <ar.DivCtnInfoDetails>
                        <ar.TitleNameProfile>{props.nameprofile}</ar.TitleNameProfile>
                        <ar.TextH5>{props.timesince} ago</ar.TextH5>
                    </ar.DivCtnInfoDetails>
                </ar.DivCtnReviewDetails>
                <ar.DivCtnIcons>
                    <ar.IconCheckConfirm />
                    <ar.IconCheckCross />
                </ar.DivCtnIcons>
            </ar.DivCtnDetails>
        </ar.ArticleReview>

    </>)
}