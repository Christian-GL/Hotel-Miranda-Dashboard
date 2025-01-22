
import * as contactCreateJS from "./contactCreate.js"
import { Form } from "../../../common/components/form/form.jsx"


export const ContactCreate = () => {

    const create = () => {

    }

    return (

        <contactCreateJS.SectionPageContactCreate>

            <Form formType='contact' createfunction={create}></Form>

        </contactCreateJS.SectionPageContactCreate>

    );
}