
import * as dashboardJS from "./dashboard.js"

import { ArticleReview } from "../../common/components/ArticleReview/articleReview.jsx"


export const Dashboard = () => {

    return (

        <dashboardJS.SectionPageDashboard>

            <dashboardJS.SectionKPIs>
                <dashboardJS.ArticleKPI>
                    <dashboardJS.IconBooking />
                    <dashboardJS.DivCtnInfo>
                        <dashboardJS.NumberH4>8,461</dashboardJS.NumberH4>
                        <dashboardJS.TextH5>New Booking</dashboardJS.TextH5>
                    </dashboardJS.DivCtnInfo>
                </dashboardJS.ArticleKPI>
                <dashboardJS.ArticleKPI>
                    <dashboardJS.IconCalendar />
                    <dashboardJS.DivCtnInfo>
                        <dashboardJS.NumberH4>963</dashboardJS.NumberH4>
                        <dashboardJS.TextH5>Scheduled Room</dashboardJS.TextH5>
                    </dashboardJS.DivCtnInfo>
                </dashboardJS.ArticleKPI>
                <dashboardJS.ArticleKPI>
                    <dashboardJS.IconLogIn />
                    <dashboardJS.DivCtnInfo>
                        <dashboardJS.NumberH4>753</dashboardJS.NumberH4>
                        <dashboardJS.TextH5>Check in</dashboardJS.TextH5>
                    </dashboardJS.DivCtnInfo>
                </dashboardJS.ArticleKPI>
                <dashboardJS.ArticleKPI>
                    <dashboardJS.IconLogOut />
                    <dashboardJS.DivCtnInfo>
                        <dashboardJS.NumberH4>516</dashboardJS.NumberH4>
                        <dashboardJS.TextH5>Check Out</dashboardJS.TextH5>
                    </dashboardJS.DivCtnInfo>
                </dashboardJS.ArticleKPI>
            </dashboardJS.SectionKPIs>

            <dashboardJS.SectionReviews>
                <dashboardJS.TitleSectionReviewsH5>Latest Review by Customers</dashboardJS.TitleSectionReviewsH5>
                <dashboardJS.DivCtnReviews>
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
                </dashboardJS.DivCtnReviews>
            </dashboardJS.SectionReviews>

        </dashboardJS.SectionPageDashboard>

    )
}