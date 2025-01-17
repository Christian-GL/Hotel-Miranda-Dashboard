
import * as db from "./dashboard.js"

import { ArticleReview } from "../../common/components/ArticleReview/articleReview.jsx"


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
                    <ArticleReview
                        nameprofile="Pedro Sánchez"
                        timesince="4m"
                        textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                    />
                    <ArticleReview
                        nameprofile="Perro Sánchez"
                        timesince="5m"
                        textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                    />
                    <ArticleReview
                        nameprofile="Pablo Sales"
                        timesince="7m"
                        textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                    />
                </db.DivCtnReviews>
            </db.SectionReviews>

        </db.SectionPageDashboard>

    )
}