
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as roomJS from "./room.js"
import { TableDisplayIndicator } from "../common/components/tableDisplaySelector/tableDisplaySelector.jsx"
import { TableSearchTerm } from "../common/components/tableSearchTerm/tableSearchTerm.jsx"
import { ButtonCreate } from "../common/components/buttonCreate/buttonCreate.jsx"
import { applyDiscount } from "../common/utils/tableUtils.js"
import { usePagination } from "../common/hooks/usePagination.js"
import * as paginationJS from '../common/styles/pagination.js'
import { Table, THTable, TriangleUp, TriangleRight, TriangleDown, DivImgTable, ImgTableRoom, PTable, PStatusRoomList, IconOptions, DivCtnOptions, ButtonOption } from "../common/styles/table.js"
import { getRoomAllData, getRoomAllStatus } from "./features/roomSlice.js";
import { RoomFetchAllThunk } from "./features/thunks/roomFetchAllThunk.js"
import { RoomDeleteByIdThunk } from "./features/thunks/roomDeleteByIdThunk.js"
import { getBookingAllData, getBookingAllStatus } from "../booking/features/bookingSlice.js"
import { BookingFetchAllThunk } from "../booking/features/thunks/bookingFetchAllThunk.js"
import { BookingDeleteByIdThunk } from "../booking/features/thunks/bookingDeleteByIdThunk.js"


export const Room = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const nameColumnList = ['', 'Room number', 'Room type', 'Amenities', 'Price', 'Offer price', 'Booking status', '']
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const [inputText, setInputText] = useState('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState()
    const [filteredRooms, setFilteredRooms] = useState([])
    const [selectedButton, setSelectedButton] = useState('all')
    const [arrowStates, setArrowStates] = useState({
        roomNumber: 'down',
        price: 'right',
        offerPrice: 'right'
    })
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
        else if (roomAllLoading === "fulfilled") { displayRooms() }
        else if (roomAllLoading === "rejected") { alert("Error en la api") }
    }, [roomAllLoading, roomAll, inputText, selectedButton, arrowStates])
    useEffect(() => {
        if (bookingAllLoading === "idle") { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === "fulfilled") { }
        else if (bookingAllLoading === "rejected") { alert("Error en la api de bookings") }
    }, [bookingAllLoading, bookingAll])

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
        displayRooms()
    }
    const displayRooms = () => {
        let filteredData
        switch (selectedButton) {
            case 'all':
                filteredData = roomAll.filter(room =>
                    room.id.toString().includes(inputText.toLowerCase())
                )
                break
            case 'available':
                filteredData = roomAll.filter(room =>
                    room.id.toString().includes(inputText.toLowerCase()) &&
                    bookingAll.filter((booking) => room.booking_list.includes(booking.id)).length === 0
                )
                break
            case 'booked':
                filteredData = roomAll.filter(room =>
                    room.id.toString().includes(inputText.toLowerCase()) &&
                    bookingAll.filter((booking) => room.booking_list.includes(booking.id)).length >= 1
                )
                break
        }
        const sortedData = sortData(filteredData)
        setFilteredRooms(sortedData)
    }
    const sortData = (filteredData) => {
        const activeColumn = Object.keys(arrowStates).find(key => arrowStates[key] !== 'right')
        let sortedData
        if (activeColumn) {
            sortedData = filteredData.sort((a, b) => {
                let valueA
                let valueB

                if (activeColumn === 'roomNumber') {
                    valueA = a.id
                    valueB = b.id
                }
                else if (activeColumn === 'price') {
                    valueA = a.price
                    valueB = b.price
                }
                else if (activeColumn === 'offerPrice') {
                    valueA = applyDiscount(a.price, a.discount)
                    valueB = applyDiscount(b.price, b.discount)
                }

                if (arrowStates[activeColumn] === 'down') {
                    return valueB > valueA ? -1 : 1
                } else {
                    return valueA > valueB ? -1 : 1
                }
            })
        }
        return sortedData
    }
    const handleColumnClick = (column) => {
        setArrowStates(prevState => {
            const newState = { ...prevState }

            if (newState[column] === 'right') { newState[column] = 'down' }
            else if (newState[column] === 'down') { newState[column] = 'up' }
            else if (newState[column] === 'up') { newState[column] = 'down' }

            Object.keys(newState).forEach(key => {
                if (key !== column) {
                    newState[key] = 'right'
                }
            })

            return newState
        })

        handleTableFilter(selectedButton)
    }
    const getArrowIcon = (column) => {
        const state = arrowStates[column]
        if (state === 'up') { return <TriangleUp /> }
        else if (state === 'down') { return <TriangleDown /> }
        else { return <TriangleRight /> }
    }
    const displayMenuOptions = (index) => {
        tableOptionsDisplayed === index ?
            setTableOptionsDisplayed() :
            setTableOptionsDisplayed(index)
    }
    const deleteRoomById = (id, index) => {
        const room = roomAll.find(room => room.id === parseInt(id))
        room.booking_list.map((bookingId) => {
            dispatch(BookingDeleteByIdThunk(parseInt(bookingId)))
        })
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
                    index === 1 || index === 4 || index === 5 ?
                        <THTable key={index} cursorPointer='yes' onClick={() => {
                            switch (index) {
                                case 1: handleColumnClick('roomNumber'); break
                                case 4: handleColumnClick('price'); break
                                case 5: handleColumnClick('offerPrice'); break
                                default: ; break
                            }
                        }}
                        >
                            {nameColumn}
                            {(() => {
                                switch (index) {
                                    case 1: return getArrowIcon('roomNumber')
                                    case 4: return getArrowIcon('price')
                                    case 5: return getArrowIcon('offerPrice')
                                    default: return null
                                }
                            })()}
                        </THTable> :
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
                            {
                                bookingAll.filter((booking) => roomData.booking_list.includes(booking.id)).length === 0 ?
                                    // roomData.booking_list.length === 0 ?
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