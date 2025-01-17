
import { GiBabyBottle } from "react-icons/gi";
import * as gb from '../../styles/globalVars.js'
import * as tableJS from "./table.js"


export const Table = (props) => {

    const formatToTerm = (phrase) => {
        const wordsSplited = phrase.replace('_', ' ').split(' ');
        for (let i = 0; i < wordsSplited.length; i++) {
            wordsSplited[i] = wordsSplited[i][0].toUpperCase() + wordsSplited[i].substr(1);
            wordsSplited[i] += ' '
        }
        return wordsSplited
    }

    const roomListDataPerRow = (roomData, index) => {
        return [
            <tableJS.DivImgTable>
                <tableJS.ImgTable src={`${roomData.photo}`} />
            </tableJS.DivImgTable>,

            <tableJS.PTable key={index + '-2'} flexdirection='column' alignitems='left' justifycontent='center'>
                <tableJS.TextGreenTableH6>{roomData.number}</tableJS.TextGreenTableH6>
                <tableJS.TextGrayTableH6>{roomData.id}</tableJS.TextGrayTableH6>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-3'} minwidth='7rem'>
                {formatToTerm(roomData.type)}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-4'}>
                {roomData.amenities}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-5'} flexdirection='row'>
                <b>${roomData.price}</b> <tableJS.PTextPerNight>&nbsp;/night</tableJS.PTextPerNight>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-6'} flexdirection='row'>
                <b>${roomData.offer_price}</b> <tableJS.PTextPerNight>&nbsp;/night</tableJS.PTextPerNight>
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
                <tableJS.ImgTable src={`${userData.photo}`} />
            </tableJS.DivImgTable>,

            <tableJS.PTable key={index + '-2'} flexdirection='column' alignitems='left' justifycontent='center'>
                <tableJS.TextBlackTableH6>{userData.full_name}</tableJS.TextBlackTableH6>
                <tableJS.TextGrayTableH6>{userData.id_employee}</tableJS.TextGrayTableH6>
                <tableJS.TextGrayTableH6>{userData.email}</tableJS.TextGrayTableH6>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-3'}>
                {userData.start_date}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-4'} minwidth='30rem'>
                {userData.description}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-4'} flexdirection='row' minwidth='10rem'>
                <tableJS.IconPhone />
                {userData.phone_number}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-7'}>
                {userData.status_active === true ?
                    <tableJS.PStatusAvailableUsers status={userData.status_active}>Active</tableJS.PStatusAvailableUsers> :
                    <tableJS.PStatusAvailableUsers status={userData.status_active}>Inactive</tableJS.PStatusAvailableUsers>
                }
            </tableJS.PTable>
        ]
    }

    const roomBookingPerRow = (bookingData, index) => {
        return [
            <tableJS.DivImgTable>
                <tableJS.ImgTable src={`${bookingData.photo}`} />
            </tableJS.DivImgTable>,

            <tableJS.PTable key={index + '-2'} flexdirection='column' alignitems='left' justifycontent='center'>
                <tableJS.TextGreenTableH6>{bookingData.full_name}</tableJS.TextGreenTableH6>
                <tableJS.TextGrayTableH6>{bookingData.id_booking}</tableJS.TextGrayTableH6>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-3'} minwidth='10rem'>
                {bookingData.order_date} {bookingData.order_time}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-4'} flexdirection='column' alignitems='left' justifycontent='center'>
                <tableJS.TextGreenTableH6>{bookingData.check_in_date}</tableJS.TextGreenTableH6>
                <tableJS.TextGreenTableH6>{bookingData.check_in_time}</tableJS.TextGreenTableH6>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-5'} flexdirection='column' alignitems='left' justifycontent='center'>
                <tableJS.TextGreenTableH6>{bookingData.check_out_date}</tableJS.TextGreenTableH6>
                <tableJS.TextGreenTableH6>{bookingData.check_out_time}</tableJS.TextGreenTableH6>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-6'} minwidth='10rem'>
                <tableJS.ButtonViewNotes>View Notes</tableJS.ButtonViewNotes>
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-7'} minwidth='11rem'>
                {formatToTerm(bookingData.room_type)} - {bookingData.room_number}
            </tableJS.PTable>,

            <tableJS.PTable key={index + '-8'}>
                {createTextStatus(bookingData.status)}
            </tableJS.PTable>
        ]
    }

    const createTextStatus = (data) => {
        switch (data) {
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

    const createRows = (data, index) => {
        switch (props.tableType) {
            case 'roomList':
                return roomListDataPerRow(data, index)
            case 'users':
                return usersDataPerRow(data, index)
            case 'booking':
                return roomBookingPerRow(data, index)
            default:
                return <></>
        }
    }


    return (
        <tableJS.Table rowlistlength={`${props.rowList.length + 1}`} columnlistlength={`${props.columnList.length}`} >
            {props.columnList.map((nameColumn, index) =>
                <tableJS.THTable key={index}>{nameColumn}</tableJS.THTable>
            )}
            {props.rowList.map((data, index) =>
                createRows(data, index)
            )}
        </tableJS.Table>
    )
}