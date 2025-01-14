
import { ButtonStyled } from "../../common/components/ButtonStyled"


export const Dashboard = () => {

    const PrimaryButtonClickHandler = () => {
        console.log("Primary Button Clicked")
    }
    const SecondaryButtonClickHandler = () => {
        console.log("Secondary Button Clicked")
    }

    return (<>

        <div className="dashboard">
            <p className="dashboard__p">Soy dashboard.jsx</p>
            <ButtonStyled type="primary" onClick={PrimaryButtonClickHandler}>Click me</ButtonStyled>
            <ButtonStyled type="secondary" onClick={SecondaryButtonClickHandler}>Click me</ButtonStyled>
        </div>

    </>)
}