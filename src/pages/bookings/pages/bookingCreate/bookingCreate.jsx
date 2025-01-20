
import * as bookingCreateJS from "./bookingCreate.js"
import { Form } from "../../../../common/components/form/form.jsx"


export const BookingCreate = () => {


    return (

        <bookingCreateJS.SectionPageBookingCreate>

            <Form formType='booking'></Form>

        </bookingCreateJS.SectionPageBookingCreate>

    );
}