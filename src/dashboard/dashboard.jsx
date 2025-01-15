
import * as db from "./dashboard.js"


export const Dashboard = () => {

    const PrimaryButtonClickHandler = () => {
        console.log("Primary Button Clicked")
    }
    const SecondaryButtonClickHandler = () => {
        console.log("Secondary Button Clicked")
    }

    return (<>

        <db.SectionDashboard>

            <db.SectionStats>
                <db.ArticleStat>
                    <db.IconBooking />
                </db.ArticleStat>
                <db.ArticleStat>
                    
                </db.ArticleStat>
                <db.ArticleStat>
                    
                </db.ArticleStat>
                <db.ArticleStat>
                    
                </db.ArticleStat>
            </db.SectionStats>

        </db.SectionDashboard>

    </>)
}