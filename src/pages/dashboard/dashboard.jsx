
import * as db from "./dashboard.js"


export const Dashboard = () => {

    return (

        <db.SectionPageDashboard>

            <db.SectionKPIs>
                <db.ArticleKPI>
                    <db.IconBooking />
                    <db.DivCtnInfo>
                        <db.NumberH4>8,461</db.NumberH4>
                        <db.TextH5>New Booking</db.TextH5>
                    </db.DivCtnInfo>
                </db.ArticleKPI>
                <db.ArticleKPI>
                    <db.IconCalendar />
                    <db.DivCtnInfo>
                        <db.NumberH4>963</db.NumberH4>
                        <db.TextH5>Scheduled Room</db.TextH5>
                    </db.DivCtnInfo>
                </db.ArticleKPI>
                <db.ArticleKPI>
                    <db.IconLogIn />
                    <db.DivCtnInfo>
                        <db.NumberH4>753</db.NumberH4>
                        <db.TextH5>Check in</db.TextH5>
                    </db.DivCtnInfo>
                </db.ArticleKPI>
                <db.ArticleKPI>
                    <db.IconLogOut />
                    <db.DivCtnInfo>
                        <db.NumberH4>516</db.NumberH4>
                        <db.TextH5>Check Out</db.TextH5>
                    </db.DivCtnInfo>
                </db.ArticleKPI>
            </db.SectionKPIs>

            <db.SectionReviews>
                <db.TitleSectionReviewsH5>Latest Review by Customers</db.TitleSectionReviewsH5>
                <db.DivCtnReviews>

                    <db.ArticleReview>
                        <db.PTextReview>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                        </db.PTextReview>
                        <db.DivCtnDetails>
                            <db.DivCtnReviewDetails>
                                <db.ImgProfile src="src\common\media\img\PedroSanchez.png" />
                                <db.DivCtnInfoDetails>
                                    <db.TitleNameProfile>Pedro Sánchez</db.TitleNameProfile>
                                    <db.TextH5>4m ago</db.TextH5>
                                </db.DivCtnInfoDetails>
                            </db.DivCtnReviewDetails>
                            <db.DivCtnIcons>
                                <db.IconCheckConfirm />
                                <db.IconCheckCross />
                            </db.DivCtnIcons>
                        </db.DivCtnDetails>
                    </db.ArticleReview>

                    <db.ArticleReview>
                        <db.PTextReview>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                        </db.PTextReview>
                        <db.DivCtnDetails>
                            <db.DivCtnReviewDetails>
                                <db.ImgProfile src="src\common\media\img\PedroSanchez.png" />
                                <db.DivCtnInfoDetails>
                                    <db.TitleNameProfile>Pedro Sánchez</db.TitleNameProfile>
                                    <db.TextH5>4m ago</db.TextH5>
                                </db.DivCtnInfoDetails>
                            </db.DivCtnReviewDetails>
                            <db.DivCtnIcons>
                                <db.IconCheckConfirm />
                                <db.IconCheckCross />
                            </db.DivCtnIcons>
                        </db.DivCtnDetails>
                    </db.ArticleReview>

                    <db.ArticleReview>
                        <db.PTextReview>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                        </db.PTextReview>
                        <db.DivCtnDetails>
                            <db.DivCtnReviewDetails>
                                <db.ImgProfile src="src\common\media\img\PedroSanchez.png" />
                                <db.DivCtnInfoDetails>
                                    <db.TitleNameProfile>Pedro Sánchez</db.TitleNameProfile>
                                    <db.TextH5>4m ago</db.TextH5>
                                </db.DivCtnInfoDetails>
                            </db.DivCtnReviewDetails>
                            <db.DivCtnIcons>
                                <db.IconCheckConfirm />
                                <db.IconCheckCross />
                            </db.DivCtnIcons>
                        </db.DivCtnDetails>
                    </db.ArticleReview>

                </db.DivCtnReviews>
            </db.SectionReviews>

        </db.SectionPageDashboard>

    )
}