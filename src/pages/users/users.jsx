
import { useState } from "react"

import * as us from "./users.js"
import { Table } from "../../common/components/table/table.jsx"
import usersData from "../../common/data/usersData.json"


export const Users = () => {

    // En la tabla el campo vacio incluye el "id", "nombre completo" e "start_date" (su columna no está nombrada)
    const nameColumnList = ['Name', '', 'Start Date', 'Description', 'Phone number', 'Status']
    const [roomList, setRoomList] = useState(usersData)

    return (

        <us.SectionPageUsers>
            <Table tableType='users' rowList={roomList} columnList={nameColumnList}></Table>
        </us.SectionPageUsers>

    )
}