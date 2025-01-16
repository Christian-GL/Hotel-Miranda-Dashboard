
import * as tb from "./table.js"

import { ButtonStatus } from "../buttonStatus/buttonStatus.jsx";

export const Table = (props) => {

    const eachFirstLetterToUppercase = (phrase) => {
        const wordsSplited = phrase.split(" ");
        for (let i = 0; i < wordsSplited.length; i++) {
            wordsSplited[i] = wordsSplited[i][0].toUpperCase() + wordsSplited[i].substr(1);
            wordsSplited[i] += ' '
        }
        return wordsSplited
    }

    const roomListDataPerRow = (roomData, index) => {
        return [
            <tb.TDTable key={index + '-1'} minwidth='10rem' maxwidth='10rem'>
                <tb.ImgTable src={`${roomData.photo}`} />
            </tb.TDTable>,

            <tb.TDTable key={index + '-2'} alignitems='left'>
                <tb.TextGreenTableH6>{roomData.number}</tb.TextGreenTableH6>
                <tb.TextGrayTableH6>{roomData.id}</tb.TextGrayTableH6>
            </tb.TDTable>,

            <tb.TDTable key={index + '-3'} minwidth='7rem' maxwidth='7rem'>
                {eachFirstLetterToUppercase(
                    roomData.type.replace('_', ' ')
                )}
            </tb.TDTable>,

            <tb.TDTable key={index + '-4'}>
                {roomData.amenities}
            </tb.TDTable>,

            <tb.TDTable key={index + '-5'} flexdirection='row'>
                <b>${roomData.price}</b> <tb.PTextPerNight>&nbsp;/night</tb.PTextPerNight>
            </tb.TDTable>,

            <tb.TDTable key={index + '-6'} flexdirection='row'>
                <b>${roomData.offer_price}</b> <tb.PTextPerNight>&nbsp;/night</tb.PTextPerNight>
            </tb.TDTable>,

            <tb.TDTable key={index + '-7'}>
                <ButtonStatus status={roomData.status} />
            </tb.TDTable>
        ]
    }

    const usersDataPerRow = (userData, index) => {
        return [
            <tb.TDTable key={index + '-1'} minwidth='10rem' maxwidth='10rem'>
                <tb.ImgTable src={`${userData.photo}`} />
            </tb.TDTable>,

            <tb.TDTable key={index + '-2'} alignitems='left'>
                <tb.TextBlackTableH6>{userData.full_name}</tb.TextBlackTableH6>
                <tb.TextGrayTableH6>{userData.id_employee}</tb.TextGrayTableH6>
                <tb.TextGrayTableH6>{userData.email}</tb.TextGrayTableH6>
            </tb.TDTable>,

            <tb.TDTable key={index + '-3'}>
                {userData.start_date}
            </tb.TDTable>,

            <tb.TDTable key={index + '-4'} minwidth='30rem' maxwidth='30rem'>
                {userData.description}
            </tb.TDTable>,

            <tb.TDTable key={index + '-4'} flexdirection='row' minwidth='10rem' maxwidth='10rem'>
                <tb.IconPhone />
                {userData.phone_number}
            </tb.TDTable>,

            <tb.TDTable key={index + '-7'}>
                <ButtonStatus status={userData.status_active} />
            </tb.TDTable>
        ]
    }

    const createTable = () => {
        switch (props.tableType) {

            case 'roomList':
                return (
                    <tb.Table rowlistlength={`${props.rowList.length + 1}`} columnlistlength={`${props.columnList.length}`} >
                        {props.columnList.map((nameColumn, index) =>
                            <tb.THTable key={index}>{nameColumn}</tb.THTable>
                        )}
                        {props.rowList.map((roomData, index) =>
                            roomListDataPerRow(roomData, index)
                        )}
                    </tb.Table>
                )

            case 'users':
                return (
                    <tb.Table rowlistlength={`${props.rowList.length + 1}`} columnlistlength={`${props.columnList.length}`} >
                        {props.columnList.map((nameColumn, index) =>
                            <tb.THTable key={index}>{nameColumn}</tb.THTable>
                        )}
                        {props.rowList.map((userData, index) =>
                            usersDataPerRow(userData, index)
                        )}
                    </tb.Table>
                )
        }
    }


    return (<>

        {createTable()}

    </>)
}