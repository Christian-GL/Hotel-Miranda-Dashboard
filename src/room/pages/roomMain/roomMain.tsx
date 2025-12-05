
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as roomMainStyles from "./roomMainStyles"
import { RoomButtonType } from "../../enums/roomButtonType"
import { RoomColumnSort } from '../../enums/roomColumnSort'
import { AppDispatch } from '../../../common/redux/store'
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { RoomInterfaceBookings } from "./../../interfaces/roomInterface"
import { RoomColumnsArrowStatesInterface } from './../../interfaces/roomColumnsArrowStatesInterface'
import { ArrowType } from "../../../common/enums/ArrowType"
import { TableDisplaySelector } from "../../../common/components/tableDisplaySelector/tableDisplaySelector"
import { TableSearchTerm } from "../../../common/components/tableSearchTerm/tableSearchTerm"
import { ButtonCreate } from "../../../common/components/buttonCreate/buttonCreate"
import { applyDiscount } from "../../../common/utils/tableUtils"
import { usePagination } from "../../../common/hooks/usePagination"
import * as paginationJS from '../../../common/styles/pagination'
import {
    Table, THTable, TriangleUp, TriangleRight, TriangleDown, DivImgTable,
    ImgTableRoom, PTable, PStatusRoomList, IconOptions, DivCtnOptions, ButtonOption
} from "../../../common/styles/tableStyles"
import { getRoomAllData, getRoomAllStatus } from "./../../features/roomSlice"
import { RoomFetchAllThunk } from "./../../features/thunks/roomFetchAllThunk"
import { RoomDeleteByIdThunk } from "./../../features/thunks/roomDeleteByIdThunk"
import { getBookingAllData, getBookingAllStatus, deleteBooking } from "../../../booking/features/bookingSlice.js"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk.js"
import { BookingInterfaceRoom } from "../../../booking/interfaces/bookingInterface"
import { BookingDeleteByIdThunk } from "../../../booking/features/thunks/bookingDeleteByIdThunk"


export const RoomMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const nameColumnList: string[] = ['', 'Room number', 'Room type', 'Amenities', 'Price', 'Offer price', 'Active', '']
    const roomAll: RoomInterfaceBookings[] = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const bookingAll: BookingInterfaceRoom[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [filteredRooms, setFilteredRooms] = useState<RoomInterfaceBookings[]>([])
    const [selectedButton, setSelectedButton] = useState<RoomButtonType>(RoomButtonType.all)
    const [arrowStates, setArrowStates] = useState<RoomColumnsArrowStatesInterface>({
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
    } = usePagination<RoomInterfaceBookings>(filteredRooms, 10)

    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { displayRooms() }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error en la api de rooms") }
    }, [roomAllLoading, roomAll, inputText, selectedButton, arrowStates])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { }
        else if (bookingAllLoading === ApiStatus.rejected) { alert("Error en la api de room > bookings") }
    }, [bookingAllLoading, bookingAll])

    const navigateToRoomCreate = () => navigate('room-create')
    const navigateToRoomUpdate = (id: string) => navigate(`room-update/${id}`)

    const handleInputTerm = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (type: RoomButtonType): void => {
        setSelectedButton(type)
        displayRooms()
    }
    const displayRooms = (): void => {
        let filteredData: RoomInterfaceBookings[]
        switch (selectedButton) {
            case RoomButtonType.all:
                filteredData = roomAll.filter(room =>
                    room.number.toString().includes(inputText.toLowerCase())
                )
                break
            case RoomButtonType.available:
                filteredData = roomAll.filter(room =>
                    room.number.toString().includes(inputText.toLowerCase()) &&
                    isAvailable(room)
                )
                break
            case RoomButtonType.booked:
                filteredData = roomAll.filter(room =>
                    room.number.toString().includes(inputText.toLowerCase()) &&
                    !isAvailable(room)
                )
                break
        }
        const sortedData = sortData(filteredData)
        setFilteredRooms(sortedData)
        resetPage()
    }
    const sortData = (filteredData: RoomInterfaceBookings[]): RoomInterfaceBookings[] => {
        const activeColumn = (Object.keys(arrowStates) as (keyof RoomColumnsArrowStatesInterface)[]).find(key => arrowStates[key] !== ArrowType.right)
        let sortedData: RoomInterfaceBookings[] = [...filteredData]
        if (activeColumn) {
            if (activeColumn === RoomColumnSort.roomNumber) {
                sortedData.sort((a, b) => {
                    let valueA: number = parseInt(a.number)
                    let valueB: number = parseInt(b.number)
                    if (arrowStates[activeColumn] === ArrowType.up) {
                        return valueB > valueA ? 1 : (valueB < valueA ? -1 : 0)
                    } else {
                        return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
                    }
                })
            }
            else if (activeColumn === RoomColumnSort.price) {
                sortedData.sort((a, b) => {
                    let valueA: number = a.price
                    let valueB: number = b.price
                    if (arrowStates[activeColumn] === ArrowType.up) {
                        return valueB > valueA ? 1 : (valueB < valueA ? -1 : 0)
                    } else {
                        return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
                    }
                })
            }
            else if (activeColumn === RoomColumnSort.offerPrice) {
                sortedData.sort((a, b) => {
                    let valueA: number = applyDiscount(a.price, a.discount)
                    let valueB: number = applyDiscount(b.price, b.discount)
                    if (arrowStates[activeColumn] === ArrowType.up) {
                        return valueB > valueA ? 1 : (valueB < valueA ? -1 : 0)
                    } else {
                        return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
                    }
                })
            }
        }
        return sortedData
    }
    const handleColumnClick = (nameColumn: RoomColumnSort): void => {
        setArrowStates(prevState => {
            const newState: RoomColumnsArrowStatesInterface = { ...prevState }

            if (newState[nameColumn] === ArrowType.right) { newState[nameColumn] = ArrowType.down }
            else if (newState[nameColumn] === ArrowType.down) { newState[nameColumn] = ArrowType.up }
            else if (newState[nameColumn] === ArrowType.up) { newState[nameColumn] = ArrowType.down }

            Object.keys(newState).map(key => {
                if (key !== nameColumn) {
                    newState[key] = ArrowType.right
                }
            })

            return newState
        })

        handleTableFilter(selectedButton)
    }
    const getArrowIcon = (nameColumn: RoomColumnSort): JSX.Element => {
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
    const deleteRoomById = (id: string, index: number): void => {
        dispatch(RoomDeleteByIdThunk(id))
            .then((response) => {
                const { roomId, bookingsToDelete } = response.payload
                if (roomId !== 0) {
                    bookingsToDelete.forEach((bookingId: string) => {
                        dispatch(deleteBooking(bookingId))
                    })
                }
            })
        displayMenuOptions(index)
        resetPage()
    }
    const isAvailable = (room: RoomInterfaceBookings): boolean => {
        return !Array.isArray(room.booking_data_list) ||
            room.booking_data_list.length === 0 ||
            !room.booking_data_list.some(booking => {
                const actualDate = new Date()
                const checkIn = new Date(booking.check_in_date)
                const checkOut = new Date(booking.check_out_date)
                return actualDate >= checkIn && actualDate <= checkOut
            })
    }


    return (
        <roomMainStyles.SectionPageRoom>
            <roomMainStyles.DivCtnFuncionality>
                <roomMainStyles.DivCtnTableDisplayFilter>
                    <TableDisplaySelector text='All Rooms' onClick={() => handleTableFilter(RoomButtonType.all)} isSelected={selectedButton === RoomButtonType.all} />
                    <TableDisplaySelector text='Available Rooms' onClick={() => handleTableFilter(RoomButtonType.available)} isSelected={selectedButton === RoomButtonType.available} />
                    <TableDisplaySelector text='Booked Rooms' onClick={() => handleTableFilter(RoomButtonType.booked)} isSelected={selectedButton === RoomButtonType.booked} />
                </roomMainStyles.DivCtnTableDisplayFilter>

                <roomMainStyles.DivCtnSearch>
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search by room number' />
                </roomMainStyles.DivCtnSearch>

                <roomMainStyles.DivCtnButton>
                    <ButtonCreate onClick={navigateToRoomCreate} children='+ New Room' />
                </roomMainStyles.DivCtnButton>
            </roomMainStyles.DivCtnFuncionality>

            <Table rowlistlength={filteredRooms.length + 1} columnlistlength={nameColumnList.length} >
                {nameColumnList.map((nameColumn, index) => {
                    let content
                    switch (index) {
                        case 1:
                            content =
                                <THTable key={index} onClick={() => handleColumnClick(RoomColumnSort.roomNumber)} cursorPointer="yes">
                                    {nameColumn}
                                    {getArrowIcon(RoomColumnSort.roomNumber)}
                                </THTable>
                            break
                        case 4:
                            content =
                                <THTable key={index} onClick={() => handleColumnClick(RoomColumnSort.price)} cursorPointer="yes">
                                    {nameColumn}
                                    {getArrowIcon(RoomColumnSort.price)}
                                </THTable>
                            break
                        case 5:
                            content =
                                <THTable key={index} onClick={() => handleColumnClick(RoomColumnSort.offerPrice)} cursorPointer="yes">
                                    {nameColumn}
                                    {getArrowIcon(RoomColumnSort.offerPrice)}
                                </THTable>
                            break
                        default:
                            content =
                                <THTable key={index}>
                                    {nameColumn}
                                </THTable>
                    }

                    return content
                })}
                {currentPageItems.map((roomData, index) => {
                    return [
                        <DivImgTable key={index + '-1'}>
                            <ImgTableRoom src={`${roomData.photos[0]}`} />
                        </DivImgTable>,

                        <PTable key={index + '-2'} flexdirection='column' alignitems='left' justifycontent='center'>
                            <div>Nº {roomData.number}</div>
                            <div>#<b>{roomData._id}</b></div>
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
                                isAvailable(roomData) ?
                                    <PStatusRoomList status='Available'>Available</PStatusRoomList> :
                                    <PStatusRoomList status='Booking'>Booking</PStatusRoomList>
                            }
                        </PTable>,

                        <PTable key={index + '-8'}>
                            <IconOptions onClick={() => { displayMenuOptions(index) }} />
                            <DivCtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} isInTable={true} >
                                <ButtonOption onClick={() => { navigateToRoomUpdate(roomData._id) }}>Update</ButtonOption>
                                <ButtonOption onClick={() => { deleteRoomById(roomData._id, index) }}>Delete</ButtonOption>
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

        </roomMainStyles.SectionPageRoom>
    )
}