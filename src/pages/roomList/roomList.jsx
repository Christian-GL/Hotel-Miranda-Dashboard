
import { useState } from "react"
import { useNavigate } from "react-router-dom";

import * as roomListJS from "./roomList.js"
import { TableDisplayIndicator } from "../../common/components/tableDisplayIndicador/tableDisplayIndicator.jsx"
import { ButtonCreate } from "../../common/components/buttonCreate/buttonCreate.jsx"
import { Table } from "../../common/components/table/table.jsx"
import roomListData from "../../common/data/roomListData.json"


export const RoomList = () => {

    const nameColumnList = ['', 'Room name', 'Room type', 'Amenities', 'Price', 'Offer Price', 'Status']
    const [roomList, setRoomList] = useState(roomListData)

    const navigate = useNavigate()
    const navigateToRoomCreate = () => {
        navigate('./create-room')
    }


    return (

        <roomListJS.SectionPageRoomList>
            <roomListJS.DivCtnFuncionality>
                <roomListJS.DivCtnTableDisplayFilter>
                    <TableDisplayIndicator text='All Rooms' />
                    <TableDisplayIndicator text='Active Rooms' />
                    <TableDisplayIndicator text='Inactive Rooms' />
                </roomListJS.DivCtnTableDisplayFilter>

                <roomListJS.DivCtnSearch>
                    <roomListJS.IconMagnifyingGlass />
                    <roomListJS.InputSearchEmployee placeholder="Search Room" />
                </roomListJS.DivCtnSearch>

                <roomListJS.DivCtnButton>
                    <ButtonCreate onclick={navigateToRoomCreate} text='+ New Room' />
                </roomListJS.DivCtnButton>
            </roomListJS.DivCtnFuncionality>

            <Table tableType='roomList' rowList={roomList} columnList={nameColumnList}></Table>
        </roomListJS.SectionPageRoomList>

    )
}