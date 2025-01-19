
import { useState } from "react"
import { useNavigate } from "react-router-dom";

import * as usersJS from "./users.js"
import { TableDisplayIndicator } from "../../common/components/tableDisplayIndicador/tableDisplayIndicator.jsx"
import { ButtonCreate } from "../../common/components/buttonCreate/buttonCreate.jsx"
import { Table } from "../../common/components/table/table.jsx"
import usersData from "../../common/data/usersData.json"


export const Users = () => {

    const nameColumnList = ['', 'Name', 'Start Date', 'Description', 'Phone number', 'Status']
    const [userList, setUserList] = useState(usersData)

    const navigate = useNavigate()
    const sss = () => {
        navigate('./create-user')
    }

    return (

        <usersJS.SectionPageUsers>

            <usersJS.DivCtnFuncionality>
                <usersJS.DivCtnTableDisplayFilter>
                    <TableDisplayIndicator text='All Employee' />
                    <TableDisplayIndicator text='Active Employee' />
                    <TableDisplayIndicator text='Inactive Employee' />
                </usersJS.DivCtnTableDisplayFilter>

                <usersJS.DivCtnSearch>
                    <usersJS.IconMagnifyingGlass />
                    <usersJS.InputSearchEmployee placeholder="Search Employee" />
                </usersJS.DivCtnSearch>

                <usersJS.DivCtnButton>
                    <ButtonCreate onclick={sss} text='+ New Employee' />
                </usersJS.DivCtnButton>
            </usersJS.DivCtnFuncionality>

            <Table tableType='users' rowList={userList} columnList={nameColumnList}></Table>
        </usersJS.SectionPageUsers>

    )
}