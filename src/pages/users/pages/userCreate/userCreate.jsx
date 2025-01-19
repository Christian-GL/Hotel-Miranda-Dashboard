
import * as userCreateJS from "./userCreate.js"
import { ButtonCreate } from "../../../../common/components/buttonCreate/buttonCreate.jsx"


export const UserCreate = () => {

    const handleSubmit = e => {
        e.preventDefault();
        console.log('Aquí crear usuario')
    }

    return (

        <userCreateJS.SectionPageUserCreate>


            <userCreateJS.DivIcon>
                <userCreateJS.IconHotel />
            </userCreateJS.DivIcon>

            <userCreateJS.Form onSubmit={handleSubmit}>
                <userCreateJS.DivCtnEntry>
                    <userCreateJS.LabelText>Photo</userCreateJS.LabelText>
                    <userCreateJS.InputText type='file' />
                </userCreateJS.DivCtnEntry>

                <userCreateJS.DivCtnEntry>
                    <userCreateJS.LabelText>Full name</userCreateJS.LabelText>
                    <userCreateJS.InputText />
                </userCreateJS.DivCtnEntry>

                <userCreateJS.DivCtnEntry>
                    <userCreateJS.LabelText>ID Employee</userCreateJS.LabelText>
                    <userCreateJS.InputText />
                </userCreateJS.DivCtnEntry>

                <userCreateJS.DivCtnEntry>
                    <userCreateJS.LabelText>Email</userCreateJS.LabelText>
                    <userCreateJS.InputText />
                </userCreateJS.DivCtnEntry>

                <userCreateJS.DivCtnEntry>
                    <userCreateJS.LabelText>Start Date</userCreateJS.LabelText>
                    <userCreateJS.InputDate type="date" />
                </userCreateJS.DivCtnEntry>

                <userCreateJS.DivCtnEntry>
                    <userCreateJS.LabelText>Job Description</userCreateJS.LabelText>
                    <userCreateJS.TextAreaJobDescription type='text'></userCreateJS.TextAreaJobDescription>
                </userCreateJS.DivCtnEntry>

                <userCreateJS.DivCtnEntry>
                    <userCreateJS.LabelText>Contact</userCreateJS.LabelText>
                    <userCreateJS.InputText />
                </userCreateJS.DivCtnEntry>

                <userCreateJS.DivCtnEntry>
                    <userCreateJS.LabelText>Status</userCreateJS.LabelText>
                    <userCreateJS.SelectStatus>
                        <userCreateJS.OptionStatus>Active</userCreateJS.OptionStatus>
                        <userCreateJS.OptionStatus>Inactive</userCreateJS.OptionStatus>
                    </userCreateJS.SelectStatus>
                </userCreateJS.DivCtnEntry>

                <userCreateJS.DivButtonCreateUser>
                    <ButtonCreate type="submit" text='+ Create User' fontsize='1.25em'></ButtonCreate>
                </userCreateJS.DivButtonCreateUser>
            </userCreateJS.Form>

        </userCreateJS.SectionPageUserCreate>

    );
}