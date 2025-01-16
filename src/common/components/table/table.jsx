
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
            <tb.ImgTable key={index + '-1'} src={`${roomData.photo}`} />,

            <tb.LiTable key={index + '-2'} alignitems='left'>
                <tb.IdTableH6>{roomData.number}</tb.IdTableH6>
                <tb.TextTableH6>{roomData.id}</tb.TextTableH6>
            </tb.LiTable>,

            <tb.LiTable key={index + '-3'}>
                {eachFirstLetterToUppercase(
                    roomData.type.replace('_', ' ')
                )}
            </tb.LiTable>,

            <tb.LiTable key={index + '-4'}>
                {roomData.amenities}
            </tb.LiTable>,

            <tb.LiTable key={index + '-5'} flexdirection='row'>
                <b>${roomData.price}</b> <tb.PTextPerNight>&nbsp;/night</tb.PTextPerNight>
            </tb.LiTable>,

            <tb.LiTable key={index + '-6'} flexdirection='row'>
                <b>${roomData.offer_price}</b> <tb.PTextPerNight>&nbsp;/night</tb.PTextPerNight>
            </tb.LiTable>,

            <tb.LiTable key={index + '-7'}>
                <ButtonStatus status={roomData.status} />
            </tb.LiTable>
        ]
    }


    return (

        <tb.UlTableRoomList rowlistlength={`${props.rowList.length + 1}`} columnlistlength={`${props.columnList.length}`} >
            {props.columnList.map((nameColumn, index) =>
                <tb.LiTable key={index} justifycontent='flex-end'><b>{nameColumn}</b></tb.LiTable>
            )}
            {props.rowList.map((roomData, index) =>
                roomListDataPerRow(roomData, index)
            )}
        </tb.UlTableRoomList>

    )
}