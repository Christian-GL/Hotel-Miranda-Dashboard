
import * as formJS from "./form.js"
import { ButtonCreate } from '../buttonCreate/buttonCreate.jsx'


export const Form = (props) => {

    const handleSubmit = e => {
        e.preventDefault();
        switch (props.formType) {
            case 'user':
                console.log('creado user')

            case 'room':
                console.log('creada room')
        }
        console.log('Aquí crear usuario')
    }

    const userCreateForm = () => {
        return [
            <formJS.DivIcon>
                <formJS.IconHotel />
            </formJS.DivIcon>,

            <formJS.Form onSubmit={handleSubmit}>
                <formJS.DivCtnEntry>
                    <formJS.LabelText>Photo</formJS.LabelText>
                    <formJS.InputText type='file' />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Full name</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>ID Employee</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Email</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Start Date</formJS.LabelText>
                    <formJS.InputDate type="date" />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Job Description</formJS.LabelText>
                    <formJS.TextAreaJobDescription type='text'></formJS.TextAreaJobDescription>
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Contact</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Status</formJS.LabelText>
                    <formJS.SelectStatus>
                        <formJS.OptionStatus>Active</formJS.OptionStatus>
                        <formJS.OptionStatus>Inactive</formJS.OptionStatus>
                    </formJS.SelectStatus>
                </formJS.DivCtnEntry>

                <formJS.DivButtonCreateUser>
                    <ButtonCreate type="submit" text='+ Create User' fontsize='1.25em'></ButtonCreate>
                </formJS.DivButtonCreateUser>
            </formJS.Form>
        ]
    }

    const roomCreateForm = () => {
        return [
            <formJS.DivIcon>
                <formJS.DivCtnIcons>
                    <formJS.IconBed />
                    <formJS.IconPlus />
                </formJS.DivCtnIcons>
            </formJS.DivIcon>,

            <formJS.Form onSubmit={handleSubmit}>
                <formJS.DivCtnEntry>
                    <formJS.LabelText>Photo</formJS.LabelText>
                    <formJS.InputText type='file' />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Room Number</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Room ID</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Room Type</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Amenities</formJS.LabelText>
                    <formJS.SelectAmenities multiple={true}>
                        <formJS.OptionStatus>3 Bed Space</formJS.OptionStatus>
                        <formJS.OptionStatus>24 Hours Guard</formJS.OptionStatus>
                        <formJS.OptionStatus>Free WiFi</formJS.OptionStatus>
                        <formJS.OptionStatus>2 Bathroom</formJS.OptionStatus>
                        <formJS.OptionStatus>Air conditioner</formJS.OptionStatus>
                        <formJS.OptionStatus>Television</formJS.OptionStatus>
                    </formJS.SelectAmenities>
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Price</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Offer Price</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Status</formJS.LabelText>
                    <formJS.SelectStatus>
                        <formJS.OptionStatus>Available</formJS.OptionStatus>
                        <formJS.OptionStatus>Booked</formJS.OptionStatus>
                    </formJS.SelectStatus>
                </formJS.DivCtnEntry>

                <formJS.DivButtonCreateUser>
                    <ButtonCreate type="submit" text='+ Create Room' fontsize='1.25em'></ButtonCreate>
                </formJS.DivButtonCreateUser>
            </formJS.Form>
        ]
    }

    const selectFormType = (formType) => {
        switch (formType) {
            case 'user':
                return userCreateForm()
            case 'room':
                return roomCreateForm()
            default:
                alert('Tipo de form no valido')
        }
    }

    return (

        <formJS.DivCtnForm>
            {selectFormType(props.formType)}
        </formJS.DivCtnForm>

    );
}