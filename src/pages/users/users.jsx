
import { useState } from "react"

import * as usersJS from "./users.js"
import { Table } from "../../common/components/table/table.jsx"
import usersData from "../../common/data/usersData.json"


export const Users = () => {

    const nameColumnList = ['', 'Name', 'Start Date', 'Description', 'Phone number', 'Status']
    const [roomList, setRoomList] = useState(usersData)

    return (

        <usersJS.SectionPageUsers>
            <Table tableType='users' rowList={roomList} columnList={nameColumnList}></Table>
        </usersJS.SectionPageUsers>

    )
}