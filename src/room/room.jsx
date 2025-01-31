
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"

import * as roomJS from "./room.js"
import { TableDisplayIndicator } from "../common/components/tableDisplaySelector/tableDisplaySelector.jsx"
import { TableSearchTerm } from "../common/components/tableSearchTerm/tableSearchTerm.jsx";
import { ButtonCreate } from "../common/components/buttonCreate/buttonCreate.jsx"
import { applyDiscount } from "../common/utils/tableUtils.js";
import { usePagination } from "../common/hooks/usePagination.js"
import * as paginationJS from '../common/styles/pagination.js'
import { Table, THTable, DivImgTable, ImgTableRoom, PTable, PStatusRoomList, IconOptions, DivCtnOptions, ButtonOption } from "../common/styles/table.js"
import { getRoomAllData, getRoomAllStatus, getRoomError } from "./features/roomSlice.js";
import { RoomFetchAllThunk } from "./features/thunks/roomFetchAllThunk.js";
import { RoomDeleteByIdThunk } from "./features/thunks/roomDeleteByIdThunk.js";


export const Room = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const nameColumnList = ['', 'Room number', 'Room type', 'Amenities', 'Price', 'Offer price', 'Booking status', '']
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const [inputText, setInputText] = useState('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState()
    const [filteredRooms, setFilteredRooms] = useState([])
    const [selectedButton, setSelectedButton] = useState('all')
    const {
        currentPageItems,
        currentPage,
        totalPages,
        goToNextPage,
        goToPrevPage,
        resetPage,
        lastPage
    } = usePagination(filteredRooms, 10)


    useEffect(() => {
        if (roomAllLoading === "idle") { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === "fulfilled") { displayAllRooms() }
        else if (roomAllLoading === "rejected") { alert("Error en la api") }
    }, [roomAllLoading, roomAll, inputText, dispatch])

    const navigateToRoomCreate = () => {
        navigate('room-create')
    }
    const navigateToRoomUpdate = (id) => {
        navigate(`room-update/${id}`)
    }

    const handleInputTerm = (e) => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (type) => {
        setSelectedButton(type)
        switch (type) {
            case 'all':
                displayAllRooms()
                break
            case 'available':
                displayInactiveRooms()
                break
            case 'booked':
                displayActiveRooms()
                break
        }
    }
    const displayAllRooms = () => {
        const filtered = roomAll.filter(room =>
            room.id.toString().includes(inputText.toLowerCase())
        )
        setFilteredRooms(filtered)
    }
    const displayActiveRooms = () => {
        const filtered = roomAll.filter(room =>
            room.id.toString().includes(inputText.toLowerCase()) && room.booking_list.length >= 1
        )
        setFilteredRooms(filtered)
    }
    const displayInactiveRooms = () => {
        const filtered = roomAll.filter(room =>
            room.id.toString().includes(inputText.toLowerCase()) && room.booking_list.length === 0
        )
        setFilteredRooms(filtered)
    }
    const displayMenuOptions = (index) => {
        tableOptionsDisplayed === index ?
            setTableOptionsDisplayed() :
            setTableOptionsDisplayed(index)
    }
    const deleteRoomById = (id, index) => {
        dispatch(RoomDeleteByIdThunk(parseInt(id)))
        displayMenuOptions(index)
    }


    return (

        <roomJS.SectionPageRoom>
            <roomJS.DivCtnFuncionality>
                <roomJS.DivCtnTableDisplayFilter>
                    <TableDisplayIndicator text='All Rooms' onClick={() => handleTableFilter('all')} isSelected={selectedButton === 'all'} />
                    <TableDisplayIndicator text='Available Rooms' onClick={() => handleTableFilter('available')} isSelected={selectedButton === 'available'} />
                    <TableDisplayIndicator text='Booked Rooms' onClick={() => handleTableFilter('booked')} isSelected={selectedButton === 'booked'} />
                </roomJS.DivCtnTableDisplayFilter>

                <roomJS.DivCtnSearch>
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search by room number' />
                </roomJS.DivCtnSearch>

                <roomJS.DivCtnButton>
                    <ButtonCreate onClick={navigateToRoomCreate} children='+ New Room' />
                </roomJS.DivCtnButton>
            </roomJS.DivCtnFuncionality>

            <Table rowlistlength={`${filteredRooms.length + 1}`} columnlistlength={`${nameColumnList.length}`} >
                {nameColumnList.map((nameColumn, index) =>
                    <THTable key={index}>{nameColumn}</THTable>
                )}
                {currentPageItems.map((roomData, index) => {
                    return [
                        <DivImgTable key={index + '-1'}>
                            <ImgTableRoom src={`${roomData.photos[0]}`} />
                        </DivImgTable>,

                        <PTable key={index + '-2'}>
                            #<b>{roomData.id}</b>
                        </PTable>,

                        <PTable key={index + '-3'}>
                            {roomData.type}
                        </PTable>,

                        <PTable key={index + '-4'}>
                            <p>{roomData.amenities.join(', ')}</p>
                        </PTable>,

                        <PTable key={index + '-5'}>
                            <b>${roomData.price}</b>&nbsp;/night
                        </PTable>,

                        <PTable key={index + '-6'}>
                            {roomData.discount === 0 ?
                                <>No Discount</> :
                                <><b>${applyDiscount(roomData.price, roomData.discount)}</b>&nbsp;/night&nbsp;(-{roomData.discount}%)</>
                            }
                        </PTable>,

                        <PTable key={index + '-7'}>
                            {roomData.booking_list.length === 0 ?
                                <PStatusRoomList status='Available'>Available</PStatusRoomList> :
                                <PStatusRoomList status='Booking'>Booking</PStatusRoomList>
                            }
                        </PTable>,

                        <PTable key={index + '-8'}>
                            <IconOptions onClick={() => { displayMenuOptions(index) }} />
                            <DivCtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} >
                                <ButtonOption onClick={() => { navigateToRoomUpdate(roomData.id) }}>Update</ButtonOption>
                                <ButtonOption onClick={() => { deleteRoomById(roomData.id, index) }}>Delete</ButtonOption>
                            </DivCtnOptions>
                        </PTable>
                    ]
                }
                )}
            </Table>

            <paginationJS.DivCtnPagination>
                <paginationJS.ButtonSwitchPage onClick={resetPage} disabled={currentPage === 1} margin='0 1rem 0 0'>
                    &lt;&lt;
                </paginationJS.ButtonSwitchPage>
                <paginationJS.ButtonSwitchPage onClick={goToPrevPage} disabled={currentPage === 1}>
                    &lt;
                </paginationJS.ButtonSwitchPage>
                <paginationJS.SpanPageCount>
                    {currentPage} of {totalPages}
                </paginationJS.SpanPageCount>
                <paginationJS.ButtonSwitchPage onClick={goToNextPage} disabled={currentPage === totalPages}>
                    &gt;
                </paginationJS.ButtonSwitchPage>
                <paginationJS.ButtonSwitchPage onClick={lastPage} disabled={currentPage === totalPages} margin='0 0 0 1rem'>
                    &gt;&gt;
                </paginationJS.ButtonSwitchPage>
            </paginationJS.DivCtnPagination>

        </roomJS.SectionPageRoom>

    )
}