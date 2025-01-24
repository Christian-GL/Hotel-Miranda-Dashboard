
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"


import * as userJS from "./user.js"
import * as gb from '../../common/styles/globalVars.js'
import { TableDisplayIndicator } from "../../common/components/table/tableDisplaySelector/tableDisplaySelector.jsx"
import { TableSearchTerm } from "../../common/components/table/tableSearchTerm/tableSearchTerm.jsx";
import { ButtonCreate } from "../../common/components/buttonCreate/buttonCreate.jsx"
import { Table, THTable, DivImgTable, ImgTableUser, PTable, PStatusAvailableUsers, IconPhone, IconOptions, DivCtnOptions, ButtonOption } from "../../common/components/table/createTable/createTable.js"
import { getUserAllData, getUserAllStatus, getUserError } from "./features/userSlice.js";
import { UserFetchAllThunk } from "./features/thunks/userFetchAllThunk.js";
import { UserDeleteByIdThunk } from "./features/thunks/userDeleteByIdThunk.js";


export const User = () => {

    const navigate = useNavigate()
    const navigateToUserCreate = () => {
        navigate('./user-create')
    }
    const navigateToUserUpdate = (id) => {
        navigate(`./user-update/${id}`)
    }

    const nameColumnList = ['', 'Name', 'Start date', 'Job description', 'Contact', 'Status', '']
    const [userDisplayed, setUserDisplayed] = useState([])
    const usersAll = useSelector(getUserAllData) || []
    const usersAllLoading = useSelector(getUserAllStatus)
    const [inputText, setInputText] = useState('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState()

    const dispatch = useDispatch()
    useEffect(() => {
        if (usersAllLoading === "idle") { dispatch(UserFetchAllThunk()) }
        else if (usersAllLoading === "fulfilled") {
            if (inputText === '') {
                setUserDisplayed(usersAll)
            }
            else {
                const filteredEmployees = usersAll.filter(employee =>
                    employee.full_name.toLowerCase().includes(inputText.toLowerCase())
                )
                setUserDisplayed(filteredEmployees)
            }

        }
        else if (usersAllLoading === "rejected") { alert("Error en la api") }
    }, [usersAllLoading, usersAll, inputText])

    const handleInputTerm = (e) => {
        setInputText(e.target.value)
    }
    const deleteUserById = (id, index) => {
        dispatch(UserDeleteByIdThunk(parseInt(id)))
        displayMenuOptions(index)
    }
    const displayMenuOptions = (index) => {
        tableOptionsDisplayed === index ?
            setTableOptionsDisplayed() :
            setTableOptionsDisplayed(index)
    }

    return (

        <userJS.SectionPageUser>

            <userJS.DivCtnFuncionality>
                <userJS.DivCtnTableDisplayFilter>
                    <TableDisplayIndicator text='All Employee' />
                    <TableDisplayIndicator text='Active Employee' />
                    <TableDisplayIndicator text='Inactive Employee' />
                </userJS.DivCtnTableDisplayFilter>

                <userJS.DivCtnSearch>
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search employee by name' />
                </userJS.DivCtnSearch>

                <userJS.DivCtnButton>
                    <ButtonCreate onclick={navigateToUserCreate} text='+ New Employee' />
                </userJS.DivCtnButton>
            </userJS.DivCtnFuncionality>

            <Table rowlistlength={`${userDisplayed.length + 1}`} columnlistlength={`${nameColumnList.length}`} >
                {nameColumnList.map((nameColumn, index) =>
                    <THTable key={index}>{nameColumn}</THTable>
                )}
                {userDisplayed.map((userData, index) => {
                    return [
                        <DivImgTable key={index + '-1'}>
                            <ImgTableUser src={`${userData.photo}`} />
                        </DivImgTable>,

                        <PTable key={index + '-2'} flexdirection='column' alignitems='left' justifycontent='center'>
                            <div style={{ color: `${gb.colorGreen}` }}>
                                <b>{userData.full_name}</b>
                            </div>
                            <div>#<b>{userData.id}</b></div>
                            <div>{userData.email}</div>
                        </PTable>,

                        <PTable key={index + '-3'}>
                            {userData.start_date}
                        </PTable>,

                        <PTable key={index + '-4'}>
                            {userData.description}
                        </PTable>,

                        <PTable key={index + '-5'} flexdirection='row'>
                            <IconPhone />
                            {userData.phone_number}
                        </PTable>,

                        <PTable key={index + '-6'}>
                            {userData.status_active === true ?
                                <PStatusAvailableUsers status={userData.status_active}>
                                    Active
                                </PStatusAvailableUsers> :

                                <PStatusAvailableUsers status={userData.status_active}>
                                    Inactive
                                </PStatusAvailableUsers>
                            }
                        </PTable>,

                        <PTable key={index + '-7'}>
                            <IconOptions onClick={() => { displayMenuOptions(index) }} />
                            <DivCtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} >
                                <ButtonOption onClick={() => { navigateToUserUpdate(userData.id) }}>Update</ButtonOption>
                                <ButtonOption onClick={() => { deleteUserById(userData.id, index) }}>Delete</ButtonOption>
                            </DivCtnOptions>
                        </PTable>
                    ]
                }
                )}
            </Table>
        </userJS.SectionPageUser>

    )
}