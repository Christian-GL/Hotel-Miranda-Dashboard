
import * as roomCreateJS from "./roomCreate.js"
import { ButtonCreate } from "../../../../common/components/buttonCreate/buttonCreate.jsx"


export const RoomCreate = () => {

    const handleSubmit = e => {
        e.preventDefault();
        console.log('Aquí crear habitación')
    }

    return (

        <roomCreateJS.SectionPageUserCreate>


            <roomCreateJS.DivIcon>
                <roomCreateJS.DivCtnIcons>
                    <roomCreateJS.IconHotel />
                    <roomCreateJS.IconPlus />
                </roomCreateJS.DivCtnIcons>
            </roomCreateJS.DivIcon>

            <roomCreateJS.Form onSubmit={handleSubmit}>
                <roomCreateJS.DivCtnEntry>
                    <roomCreateJS.LabelText>Photo</roomCreateJS.LabelText>
                    <roomCreateJS.InputText type='file' />
                </roomCreateJS.DivCtnEntry>

                <roomCreateJS.DivCtnEntry>
                    <roomCreateJS.LabelText>Room Number</roomCreateJS.LabelText>
                    <roomCreateJS.InputText />
                </roomCreateJS.DivCtnEntry>

                <roomCreateJS.DivCtnEntry>
                    <roomCreateJS.LabelText>Room ID</roomCreateJS.LabelText>
                    <roomCreateJS.InputText />
                </roomCreateJS.DivCtnEntry>

                <roomCreateJS.DivCtnEntry>
                    <roomCreateJS.LabelText>Room Type</roomCreateJS.LabelText>
                    <roomCreateJS.InputText />
                </roomCreateJS.DivCtnEntry>

                <roomCreateJS.DivCtnEntry>
                    <roomCreateJS.LabelText>Amenities</roomCreateJS.LabelText>
                    <roomCreateJS.SelectAmenities multiple={true}>
                        <roomCreateJS.OptionStatus>3 Bed Space</roomCreateJS.OptionStatus>
                        <roomCreateJS.OptionStatus>24 Hours Guard</roomCreateJS.OptionStatus>
                        <roomCreateJS.OptionStatus>Free WiFi</roomCreateJS.OptionStatus>
                        <roomCreateJS.OptionStatus>2 Bathroom</roomCreateJS.OptionStatus>
                        <roomCreateJS.OptionStatus>Air conditioner</roomCreateJS.OptionStatus>
                        <roomCreateJS.OptionStatus>Television</roomCreateJS.OptionStatus>
                    </roomCreateJS.SelectAmenities>
                </roomCreateJS.DivCtnEntry>

                <roomCreateJS.DivCtnEntry>
                    <roomCreateJS.LabelText>Price</roomCreateJS.LabelText>
                    <roomCreateJS.InputText />
                </roomCreateJS.DivCtnEntry>

                <roomCreateJS.DivCtnEntry>
                    <roomCreateJS.LabelText>Offer Price</roomCreateJS.LabelText>
                    <roomCreateJS.InputText />
                </roomCreateJS.DivCtnEntry>

                <roomCreateJS.DivCtnEntry>
                    <roomCreateJS.LabelText>Status</roomCreateJS.LabelText>
                    <roomCreateJS.SelectStatus>
                        <roomCreateJS.OptionStatus>Available</roomCreateJS.OptionStatus>
                        <roomCreateJS.OptionStatus>Booked</roomCreateJS.OptionStatus>
                    </roomCreateJS.SelectStatus>
                </roomCreateJS.DivCtnEntry>

                <roomCreateJS.DivButtonCreateUser>
                    <ButtonCreate type="submit" text='+ Create Room' fontsize='1.25em'></ButtonCreate>
                </roomCreateJS.DivButtonCreateUser>
            </roomCreateJS.Form>

        </roomCreateJS.SectionPageUserCreate>

    );
}