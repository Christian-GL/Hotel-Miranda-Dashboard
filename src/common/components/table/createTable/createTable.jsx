
import { useState } from "react"
import { useNavigate } from "react-router-dom";

import * as gb from '../../../styles/globalVars.js'
import * as tableJS from "./createTable.js"


export const Table = (props) => {

    const [optionsDisplayed, setOptionsDisplayed] = useState(false);

    const formatToTerm = (phrase) => {
        const wordsSplited = phrase.replace('_', ' ').split(' ');
        for (let i = 0; i < wordsSplited.length; i++) {
            wordsSplited[i] = wordsSplited[i][0].toUpperCase() + wordsSplited[i].substr(1);
            wordsSplited[i] += ' '
        }
        return wordsSplited
    }

    const createTextStatus = (bookingDataStatus) => {
        switch (bookingDataStatus) {
            case 'check_in':
                return <tableJS.PStatusBooking color={`${gb.colorGreen}`} backgroundcolor={`${gb.colorLightGreenButtonTable}`}>
                    Check In
                </tableJS.PStatusBooking>
            case 'check_out':
                return <tableJS.PStatusBooking color={`${gb.colorRed}`} backgroundcolor={`${gb.colorLightRedButtonTable}`}>
                    Check Out
                </tableJS.PStatusBooking>
            case 'in_progress':
                return <tableJS.PStatusBooking color={`${gb.colorLightRedButtonTable2}`} backgroundcolor={`${gb.colorLightGreenButtonTable2}`}>
                    In Progress
                </tableJS.PStatusBooking>
            default:
                return <></>
        }
    }

    const navigate = useNavigate()
    const navigateToBookingDetail = () => {
        navigate('./booking-detail')
    }

    const sss = () => {
        setOptionsDisplayed(!optionsDisplayed)
    }

    const roomListDataPerRow = (roomData, index) => {
        return [
            <tableJS.DivImgTable>
                <tableJS.ImgTableRoom src={`${roomData.photo}`} />
            </tableJS.DivImgTable>,

            <tableJS.PTable key={index + '-2'} flexdirection='column' alignitems='left' justifycontent='center'>
                <div style={{ color: `${gb.colorGreen}` }}>
                    <b>{roomData.number}</b>
                </div>
                <div><b>{roomData.id}</b></div>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-3'}>
                {formatToTerm(roomData.type)}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-4'}>
                {roomData.amenities}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-5'} flexdirection='row'>
                <b>${roomData.price}</b> <div>&nbsp;/night</div>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-6'} flexdirection='row'>
                <b>${roomData.offer_price}</b> <div>&nbsp;/night</div>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-7'}>
                {roomData.status === true ?
                    <tableJS.PStatusRoomList status={roomData.status}>Available</tableJS.PStatusRoomList> :
                    <tableJS.PStatusRoomList status={roomData.status}>Booking</tableJS.PStatusRoomList>
                }
            </tableJS.PTable>
        ]
    }

    const usersDataPerRow = (userData, index) => {
        return [
            <tableJS.DivImgTable>
                <tableJS.ImgTableUser src={`${userData.photo}`} />
            </tableJS.DivImgTable>,

            <tableJS.PTable key={index + '-2'} flexdirection='column' alignitems='left' justifycontent='center'>
                <div style={{ color: `${gb.colorGreen}` }}>
                    <b>{userData.full_name}</b>
                </div>
                <div><b>{userData.id_employee}</b></div>
                <div>{userData.email}</div>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-3'}>
                {userData.start_date}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-4'}>
                {userData.description}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-4'} flexdirection='row'>
                <tableJS.IconPhone />
                {userData.phone_number}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-7'}>
                {userData.status_active === true ?
                    <tableJS.PStatusAvailableUsers status={userData.status_active}>
                        Active
                        <tableJS.DivCtnAllOptions>
                            <tableJS.IconOptions onClick={sss} />
                            <tableJS.DivCtnOptions display={`${optionsDisplayed ? 'flex' : 'none'}`} >
                                <tableJS.ButtonOption>Make Inactive</tableJS.ButtonOption>
                                <tableJS.ButtonOption>Delete</tableJS.ButtonOption>
                            </tableJS.DivCtnOptions>
                        </tableJS.DivCtnAllOptions>
                    </tableJS.PStatusAvailableUsers> :
                    <tableJS.PStatusAvailableUsers status={userData.status_active}>
                        Inactive
                        <tableJS.DivCtnAllOptions>
                            <tableJS.IconOptions onClick={sss} />
                            <tableJS.DivCtnOptions display={`${optionsDisplayed ? 'flex' : 'none'}`} >
                                <tableJS.ButtonOption>Make Active</tableJS.ButtonOption>
                                <tableJS.ButtonOption>Delete</tableJS.ButtonOption>
                            </tableJS.DivCtnOptions>
                        </tableJS.DivCtnAllOptions>
                    </tableJS.PStatusAvailableUsers>
                }
            </tableJS.PTable>
        ]
    }

    const roomBookingPerRow = (bookingData, index) => {
        return [
            <tableJS.DivImgTable>
                <tableJS.ImgTableUser src={`${bookingData.photo}`} />
            </tableJS.DivImgTable>,

            <tableJS.PTable key={index + '-2'} flexdirection='column' alignitems='left' justifycontent='center'>
                <div style={{ color: `${gb.colorGreen}` }}>
                    <b>{bookingData.full_name}</b>
                </div>
                <div><b>{bookingData.id_booking}</b></div>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-3'} >
                {bookingData.order_date} {bookingData.order_time}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-4'} flexdirection='column' alignitems='left' justifycontent='center'>
                <div>{bookingData.check_in_date}</div>
                <div>{bookingData.check_in_time}</div>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-5'} flexdirection='column' alignitems='left' justifycontent='center'>
                <div>{bookingData.check_out_date}</div>
                <div>{bookingData.check_out_time}</div>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-6'}>
                <tableJS.ButtonViewNotes onClick={() => navigateToBookingDetail()}>View Notes</tableJS.ButtonViewNotes>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-7'}>
                {formatToTerm(bookingData.room_type)} - {bookingData.room_number}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-8'}>
                {createTextStatus(bookingData.status)}
                {/* {() => {
                    switch (bookingData.status) {
                        case 'check_in':
                            return <tableJS.PStatusBooking color={`${gb.colorGreen}`} backgroundcolor={`${gb.colorLightGreenButtonTable}`}>
                                Check In
                            </tableJS.PStatusBooking>
                        case 'check_out':
                            return <tableJS.PStatusBooking color={`${gb.colorRed}`} backgroundcolor={`${gb.colorLightRedButtonTable}`}>
                                Check Out
                            </tableJS.PStatusBooking>
                        case 'in_progress':
                            return <tableJS.PStatusBooking color={`${gb.colorLightRedButtonTable2}`} backgroundcolor={`${gb.colorLightGreenButtonTable2}`}>
                                In Progress
                            </tableJS.PStatusBooking>
                        default:
                            return <></>
                    }
                }
                } */}
            </tableJS.PTable>
        ]
    }

    const contactDataPerRow = (contactData, index) => {
        return [
            <tableJS.PTable key={index + '-1'}>
                {contactData.id_comment}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-2'} >
                {contactData.publish_date} {contactData.publish_time}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-3'} flexdirection='column' alignitems='left' justifycontent='center'>
                <div style={{ color: `${gb.colorGreen}` }}>
                    <b>{contactData.full_name}</b>
                </div>
                <div>{contactData.email}</div>
                <div style={{ display: 'flex', alignItems: 'bottom' }}>
                    <tableJS.IconPhone width='1.3rem' />
                    <div>{contactData.contact}</div>
                </div>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-4'} >
                {contactData.comment}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-5'}>
                <tableJS.ButtonPublishArchive color={`${gb.colorGreen}`}>Publish</tableJS.ButtonPublishArchive>
                <tableJS.ButtonPublishArchive color={`${gb.colorRed}`}>Archive</tableJS.ButtonPublishArchive>
            </tableJS.PTable>,
        ]
    }


    return (
        <tableJS.Table rowlistlength={`${props.rowList.length + 1}`} columnlistlength={`${props.columnList.length}`} >
            {props.columnList.map((nameColumn, index) =>
                <tableJS.TRTable key={index}>{nameColumn}</tableJS.TRTable>
            )}
            {props.rowList.map((data, index) => {
                switch (props.tableType) {
                    case 'roomList':
                        return roomListDataPerRow(data, index)
                    case 'users':
                        return usersDataPerRow(data, index)
                    case 'booking':
                        return roomBookingPerRow(data, index)
                    case 'contact':
                        return contactDataPerRow(data, index)
                    default:
                        return <></>
                }
            }
            )}
        </tableJS.Table>
    )
}