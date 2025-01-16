
import * as db from "./dashboard.js"


export const Dashboard = () => {

    const PrimaryButtonClickHandler = () => {
        console.log("Primary Button Clicked")
    }
    const SecondaryButtonClickHandler = () => {
        console.log("Secondary Button Clicked")
    }

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
                        Review 1
                    </db.ArticleReview>
                    <db.ArticleReview>
                        Review 2
                    </db.ArticleReview>
                    <db.ArticleReview>
                        Review 3
                    </db.ArticleReview>
                </db.DivCtnReviews>
            </db.SectionReviews>

        </db.SectionPageDashboard>

    )
}