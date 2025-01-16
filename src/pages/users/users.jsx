
import { useState } from "react"

import roomListData from "../../common/data/roomListData.json"
import * as us from "./users.js"
import { Table } from "../../common/components/table/table.jsx"


export const Users = () => {

    // En la tabla el campo vacio incluye el "id" y el "número" de habitación (su columna no está nombrada)
    const nameColumnList = ['Room name', '', 'Room type', 'Amenities', 'Price', 'Offer Price', 'Status']
    const [roomList, setRoomList] = useState(roomListData)

    return (

        <us.SectionPageUsers>
            <Table rowList={roomList} columnList={nameColumnList}></Table>
        </us.SectionPageUsers>

    )
}