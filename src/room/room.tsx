
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as roomStyles from "./roomStyles.ts"
import { ToastContainer, toast } from 'react-toastify'
import { Toastify } from "../common/components/toastify/toastify.tsx"
import { AppDispatch } from '../common/redux/store.ts'
import { ApiStatus } from "../common/enums/ApiStatus.ts"
import { RoomInterface } from "./interfaces/roomInterface.ts"
import { RoomColumnsArrowStatesInterface } from './interfaces/roomColumnsArrowStatesInterface.ts'
import { ArrowType } from "../common/enums/ArrowType.ts"
import { TableDisplayIndicator } from "../common/components/tableDisplaySelector/tableDisplaySelector.tsx"
import { TableSearchTerm } from "../common/components/tableSearchTerm/tableSearchTerm.tsx"
import { ButtonCreate } from "../common/components/buttonCreate/buttonCreate.tsx"
import { applyDiscount } from "../common/utils/tableUtils.ts"
import { usePagination } from "../common/hooks/usePagination.ts"
import * as paginationJS from '../common/styles/pagination.ts'
import { Table, THTable, TriangleUp, TriangleRight, TriangleDown, DivImgTable, ImgTableRoom, PTable, PStatusRoomList, IconOptions, DivCtnOptions, ButtonOption } from "../common/styles/tableStyles.ts"
import { getRoomAllData, getRoomAllStatus } from "./features/roomSlice.ts"
import { RoomFetchAllThunk } from "./features/thunks/roomFetchAllThunk.ts"
import { RoomDeleteByIdThunk } from "./features/thunks/roomDeleteByIdThunk.ts"
import { getBookingAllData, getBookingAllStatus } from "../booking/features/bookingSlice.js"
import { BookingFetchAllThunk } from "../booking/features/thunks/bookingFetchAllThunk.js"
import { BookingDeleteByIdThunk } from "../booking/features/thunks/bookingDeleteByIdThunk.js"


export const Room = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    enum ButtonType {
        all = "all",
        available = "available",
        booked = "booked"
    }
    enum columnsSortAvailable {
        roomNumber = 'roomNumber',
        price = 'price',
        offerPrice = 'offerPrice'
    }
    const nameColumnList = ['', 'Room number', 'Room type', 'Amenities', 'Price', 'Offer price', 'Booking status', '']
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [filteredRooms, setFilteredRooms] = useState<RoomInterface[]>([])
    const [selectedButton, setSelectedButton] = useState<ButtonType>(ButtonType.all)
    const [arrowStates, setArrowStates] = useState({
        roomNumber: ArrowType.down,
        price: ArrowType.right,
        offerPrice: ArrowType.right
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
    const [toastShown, setToastShown] = useState<boolean>(false)

    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { displayRooms() }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error en la api de rooms") }
    }, [roomAllLoading, roomAll, inputText, selectedButton, arrowStates])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { }
        else if (bookingAllLoading === ApiStatus.rejected) { alert("Error en la api de bookings") }
    }, [bookingAllLoading, bookingAll])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.pending || roomAllLoading === ApiStatus.pending) {
            if (!toastShown) {
                Toastify()
                setToastShown(true)
            }
        } else { toast.dismiss() }
    }, [bookingAllLoading, roomAllLoading])

    const navigateToRoomCreate = (): void => {
        navigate('room-create')
    }
    const navigateToRoomUpdate = (id: number): void => {
        navigate(`room-update/${id}`)
    }

    const handleInputTerm = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (type: ButtonType): void => {
        setSelectedButton(type)
        displayRooms()
    }
    const displayRooms = (): void => {
        let filteredData: RoomInterface[]
        switch (selectedButton) {
            case ButtonType.all:
                filteredData = roomAll.filter(room =>
                    room.id.toString().includes(inputText.toLowerCase())
                )
                break
            case ButtonType.available:
                filteredData = roomAll.filter(room =>
                    room.id.toString().includes(inputText.toLowerCase()) &&
                    bookingAll.filter((booking) => room.booking_list.includes(booking.id)).length === 0
                )
                break
            case ButtonType.booked:
                filteredData = roomAll.filter(room =>
                    room.id.toString().includes(inputText.toLowerCase()) &&
                    bookingAll.filter((booking) => room.booking_list.includes(booking.id)).length >= 1
                )
                break
        }
        const sortedData = sortData(filteredData)
        setFilteredRooms(sortedData)
    }
    const sortData = (filteredData: RoomInterface[]): RoomInterface[] => {
        const activeColumn = Object.keys(arrowStates).find(key => arrowStates[key] !== ArrowType.right)
        let sortedData: RoomInterface[] = [...filteredData]
        if (activeColumn) {
            sortedData.sort((a, b) => {
                let valueA: number | string
                let valueB: number | string

                if (activeColumn === columnsSortAvailable.roomNumber) {
                    valueA = a.id
                    valueB = b.id
                }
                else if (activeColumn === columnsSortAvailable.price) {
                    valueA = a.price
                    valueB = b.price
                }
                else if (activeColumn === columnsSortAvailable.offerPrice) {
                    valueA = applyDiscount(a.price, a.discount)
                    valueB = applyDiscount(b.price, b.discount)
                }
                else {
                    valueA = 'activeColumn no encontrada'
                    valueB = 'activeColumn no encontrada'
                }

                if (arrowStates[activeColumn] === ArrowType.down) {
                    return valueB > valueA ? -1 : 1
                } else {
                    return valueA > valueB ? -1 : 1
                }
            })
        }
        return sortedData
    }
    const handleColumnClick = (nameColumn: columnsSortAvailable): void => {
        setArrowStates(prevState => {
            const newState: RoomColumnsArrowStatesInterface = { ...prevState }

            if (newState[nameColumn] === ArrowType.right) { newState[nameColumn] = ArrowType.down }
            else if (newState[nameColumn] === ArrowType.down) { newState[nameColumn] = ArrowType.up }
            else if (newState[nameColumn] === ArrowType.up) { newState[nameColumn] = ArrowType.down }

            Object.keys(newState).forEach(key => {
                if (key !== nameColumn) {
                    newState[key] = ArrowType.right
                }
            })

            return newState
        })

        handleTableFilter(selectedButton)
    }
    const getArrowIcon = (nameColumn: columnsSortAvailable): JSX.Element => {
        const state = arrowStates[nameColumn]
        if (state === ArrowType.up) { return <TriangleUp /> }
        else if (state === ArrowType.down) { return <TriangleDown /> }
        else { return <TriangleRight /> }
    }
    const displayMenuOptions = (index: number): void => {
        tableOptionsDisplayed === index ?
            setTableOptionsDisplayed(-1) :
            setTableOptionsDisplayed(index)
    }
    const deleteRoomById = (id: number, index: number): void => {
        const room = roomAll.find(room => room.id === id)
        if (room) {
            room.booking_list.map(bookingId => {
                dispatch(BookingDeleteByIdThunk(bookingId))
            })
        }
        dispatch(RoomDeleteByIdThunk(id))
        displayMenuOptions(index)
        resetPage()
    }


    return (
        bookingAllLoading === ApiStatus.pending || roomAllLoading === ApiStatus.pending ?
            <ToastContainer /> :
            <roomStyles.SectionPageRoom>
                <roomStyles.DivCtnFuncionality>
                    <roomStyles.DivCtnTableDisplayFilter>
                        <TableDisplayIndicator text='All Rooms' onClick={() => handleTableFilter(ButtonType.all)} isSelected={selectedButton === ButtonType.all} />
                        <TableDisplayIndicator text='Available Rooms' onClick={() => handleTableFilter(ButtonType.available)} isSelected={selectedButton === ButtonType.available} />
                        <TableDisplayIndicator text='Booked Rooms' onClick={() => handleTableFilter(ButtonType.booked)} isSelected={selectedButton === ButtonType.booked} />
                    </roomStyles.DivCtnTableDisplayFilter>

                    <roomStyles.DivCtnSearch>
                        <TableSearchTerm onchange={handleInputTerm} placeholder='Search by room number' />
                    </roomStyles.DivCtnSearch>

                    <roomStyles.DivCtnButton>
                        <ButtonCreate onClick={navigateToRoomCreate} children='+ New Room' />
                    </roomStyles.DivCtnButton>
                </roomStyles.DivCtnFuncionality>

                <Table rowlistlength={filteredRooms.length + 1} columnlistlength={nameColumnList.length} >
                    {nameColumnList.map((nameColumn, index) =>
                        index === 1 || index === 4 || index === 5 ?
                            <THTable key={index} cursorPointer='yes' onClick={() => {
                                switch (index) {
                                    case 1: handleColumnClick(columnsSortAvailable.roomNumber); break
                                    case 4: handleColumnClick(columnsSortAvailable.price); break
                                    case 5: handleColumnClick(columnsSortAvailable.offerPrice); break
                                    default: ; break
                                }
                            }}
                            >
                                {nameColumn}
                                {(() => {
                                    switch (index) {
                                        case 1: return getArrowIcon(columnsSortAvailable.roomNumber)
                                        case 4: return getArrowIcon(columnsSortAvailable.price)
                                        case 5: return getArrowIcon(columnsSortAvailable.offerPrice)
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

            </roomStyles.SectionPageRoom>
    )
}