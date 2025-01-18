
import * as gb from '../../../../common/styles/globalVars.js'
import * as bookingDetailsJS from "./bookingDetails.js"


export const BookingDetails = () => {


    return (

        <bookingDetailsJS.SectionPageBookingDetails>
            <bookingDetailsJS.DivSection padding='2em'>
                <bookingDetailsJS.DivCtnImgAndMainData>
                    <bookingDetailsJS.ImgProfile src="src/common/assets/img/HC.png" />
                    <bookingDetailsJS.DivCtnMainData>
                        <bookingDetailsJS.DivCtnNameId>
                            <bookingDetailsJS.NameProfileH2>Henry Cavill</bookingDetailsJS.NameProfileH2>
                            <bookingDetailsJS.SubTittleH4 color={`${gb.colorGreen}`}>ID: 1234567890</bookingDetailsJS.SubTittleH4>
                        </bookingDetailsJS.DivCtnNameId>
                        <bookingDetailsJS.DivCtnContactMessage>
                            <bookingDetailsJS.IconPhone />
                            <bookingDetailsJS.ButtonSendMessage>
                                <bookingDetailsJS.IconChat />
                                Send Message
                            </bookingDetailsJS.ButtonSendMessage>
                        </bookingDetailsJS.DivCtnContactMessage>
                    </bookingDetailsJS.DivCtnMainData>
                    <bookingDetailsJS.IconOptions />
                </bookingDetailsJS.DivCtnImgAndMainData>

                <bookingDetailsJS.DivCheckInOut>
                    <bookingDetailsJS.Div50PercentageSection>
                        <bookingDetailsJS.SubTittleH4 color={`${gb.colorGraySubTitleBookingDetails}`}>
                            Check In
                        </bookingDetailsJS.SubTittleH4>
                        <bookingDetailsJS.SubTittleH4 paddingtop='1em' color={`${gb.colorBlack26}`}>
                            October 30th, 2020 | 08:23 AM
                        </bookingDetailsJS.SubTittleH4>
                    </bookingDetailsJS.Div50PercentageSection>
                    <bookingDetailsJS.Div50PercentageSection>
                        <bookingDetailsJS.SubTittleH4 color={`${gb.colorGraySubTitleBookingDetails}`}>
                            Check Out
                        </bookingDetailsJS.SubTittleH4>
                        <bookingDetailsJS.SubTittleH4 paddingtop='1em' color={`${gb.colorBlack26}`}>
                            November 2th, 2020
                        </bookingDetailsJS.SubTittleH4>
                    </bookingDetailsJS.Div50PercentageSection>
                </bookingDetailsJS.DivCheckInOut>

                <bookingDetailsJS.DivCtnInfo>
                    <bookingDetailsJS.Div50PercentageSection>
                        <bookingDetailsJS.SubTittleH4 color={`${gb.colorGraySubTitleBookingDetails}`}>
                            Room Info
                        </bookingDetailsJS.SubTittleH4>
                        <bookingDetailsJS.SubTittleH4 paddingtop='0.5em' fontsize='1.25em' color={`${gb.colorBlack26}`}>
                            Deluxe Z - 002424
                        </bookingDetailsJS.SubTittleH4>
                    </bookingDetailsJS.Div50PercentageSection>
                    <bookingDetailsJS.Div50PercentageSection>
                        <bookingDetailsJS.SubTittleH4 color={`${gb.colorGraySubTitleBookingDetails}`}>
                            Price
                        </bookingDetailsJS.SubTittleH4>
                        <bookingDetailsJS.SubTittleH4 paddingtop='0.5em' fontsize='1.25em' color={`${gb.colorBlack26}`}>
                            $145 /night
                        </bookingDetailsJS.SubTittleH4>
                    </bookingDetailsJS.Div50PercentageSection>
                </bookingDetailsJS.DivCtnInfo>

                <bookingDetailsJS.PTextInfo>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                    ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </bookingDetailsJS.PTextInfo>

                <bookingDetailsJS.DivCtnFacilities>
                    <bookingDetailsJS.SubTittleH4 color={`${gb.colorGraySubTitleBookingDetails}`}>Facilities</bookingDetailsJS.SubTittleH4>
                    <bookingDetailsJS.ButtonFacility withicon='true'>
                        3 Bed Space
                        <bookingDetailsJS.IconBed />
                    </bookingDetailsJS.ButtonFacility>
                    <bookingDetailsJS.ButtonFacility withicon='true'>
                        24 Gours Guard
                        <bookingDetailsJS.IconShieldCheck />
                    </bookingDetailsJS.ButtonFacility>
                    <bookingDetailsJS.ButtonFacility withicon='true'>
                        Free Wifi
                        <bookingDetailsJS.IconWiFi />
                    </bookingDetailsJS.ButtonFacility>
                    <bookingDetailsJS.ButtonFacility>2 Bathroom</bookingDetailsJS.ButtonFacility>
                    <bookingDetailsJS.ButtonFacility>Air conditioner</bookingDetailsJS.ButtonFacility>
                    <bookingDetailsJS.ButtonFacility>Television</bookingDetailsJS.ButtonFacility>
                </bookingDetailsJS.DivCtnFacilities>
            </bookingDetailsJS.DivSection>

            <bookingDetailsJS.DivSection>
                <bookingDetailsJS.ImgRoom src="http://dummyimage.com/816x989.png/cc0000/ffffff" />
            </bookingDetailsJS.DivSection>
        </bookingDetailsJS.SectionPageBookingDetails>

    )
}