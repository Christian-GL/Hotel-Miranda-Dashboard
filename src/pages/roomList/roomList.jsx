
import { useState } from "react"

import * as roomListJS from "./roomList.js"
import { Table } from "../../common/components/table/table.jsx"
import roomListData from "../../common/data/roomListData.json"


export const RoomList = () => {

    const nameColumnList = ['', 'Room name', 'Room type', 'Amenities', 'Price', 'Offer Price', 'Status']
    const [roomList, setRoomList] = useState(roomListData)

    return (

        <roomListJS.SectionPageRoomList>
            <Table tableType='roomList' rowList={roomList} columnList={nameColumnList}></Table>
        </roomListJS.SectionPageRoomList>

    )
}