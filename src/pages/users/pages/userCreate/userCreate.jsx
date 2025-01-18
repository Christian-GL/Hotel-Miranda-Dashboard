
import * as a from "./userCreate.js"
// KAMBIAR AL FINAL POR "userCreateJS"          <---- !!
import { ButtonCreate } from "../../../../common/components/buttonCreate/buttonCreate.jsx"


export const UserCreate = () => {

    const handleSubmit = e => {
        e.preventDefault();
        console.log('Aquí crear usuario')
    }

    return (

        <a.SectionPageUserCreate>

            <div style={{ textAlign: 'center' }}>
                <a.IconHotel />
            </div>

            <a.Form onSubmit={handleSubmit}>
                <a.DivCtnEntry>
                    <a.LabelText>Photo</a.LabelText>
                    <a.InputText type='file' />
                </a.DivCtnEntry>

                <a.DivCtnEntry>
                    <a.LabelText>Full name</a.LabelText>
                    <a.InputText />
                </a.DivCtnEntry>

                <a.DivCtnEntry>
                    <a.LabelText>ID Employee</a.LabelText>
                    <a.InputText />
                </a.DivCtnEntry>

                <a.DivCtnEntry>
                    <a.LabelText>Email</a.LabelText>
                    <a.InputText />
                </a.DivCtnEntry>

                <a.DivCtnEntry>
                    <a.LabelText>Start Date</a.LabelText>
                    <a.InputDate type="date" />
                </a.DivCtnEntry>

                <a.DivCtnEntry>
                    <a.LabelText>Job Description</a.LabelText>
                    <a.TextAreaJobDescription type='text'></a.TextAreaJobDescription>
                </a.DivCtnEntry>

                <a.DivCtnEntry>
                    <a.LabelText>Contact</a.LabelText>
                    <a.InputText />
                </a.DivCtnEntry>

                <a.DivCtnEntry>
                    <a.LabelText>Status</a.LabelText>
                    <a.SelectStatus>
                        <a.OptionStatus>Active</a.OptionStatus>
                        <a.OptionStatus>Inactive</a.OptionStatus>
                    </a.SelectStatus>
                </a.DivCtnEntry>

                <div style={{ textAlign: 'center' }}>
                    <ButtonCreate type="submit" text='+ Create User' fontsize='1.25em'></ButtonCreate>
                </div>
            </a.Form>

        </a.SectionPageUserCreate>

    );
}