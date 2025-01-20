
import * as roomCreateJS from "./roomCreate.js"
import { Form } from "../../../../common/components/form/form.jsx"


export const RoomCreate = () => {


    return (

        <roomCreateJS.SectionPageUserCreate>

            <Form formType='room'></Form>

        </roomCreateJS.SectionPageUserCreate>

    );
}