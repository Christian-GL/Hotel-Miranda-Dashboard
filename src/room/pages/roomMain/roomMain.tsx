
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as roomMainStyles from "./roomMainStyles"
import { RoomButtonType } from "../../enums/roomButtonType"
import { AppDispatch } from '../../../common/redux/store'
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { RoomInterfaceBookings } from "./../../interfaces/roomInterface"
import { getArrowIcon } from "common/utils/getArrowIcon"
import { sortValues } from "common/utils/sortValues"
import { handleColumnClick } from "common/utils/handleColumnClick"
import { ArrowType } from "../../../common/enums/ArrowType"
import { RoomNameColumn } from "../../enums/roomNameColumn"
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
import { BookingInterfaceData } from "../../../booking/interfaces/bookingInterface"


export const RoomMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const roomAll: RoomInterfaceBookings[] = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const bookingAll: BookingInterfaceData[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [filteredRooms, setFilteredRooms] = useState<RoomInterfaceBookings[]>([])
    const [selectedButton, setSelectedButton] = useState<RoomButtonType>(RoomButtonType.all)
    const sortableColumns: RoomNameColumn[] = [
        RoomNameColumn.number,
        RoomNameColumn.type,
        RoomNameColumn.price,
        RoomNameColumn.discount
    ]
    type ArrowStates = Partial<Record<RoomNameColumn, ArrowType>>
    const [arrowStates, setArrowStates] = useState<ArrowStates>({
        [RoomNameColumn.number]: ArrowType.down,
        [RoomNameColumn.type]: ArrowType.right,
        [RoomNameColumn.price]: ArrowType.right,
        [RoomNameColumn.discount]: ArrowType.right
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

    const handleInputTerm = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (selectedButton: RoomButtonType): void => {
        setSelectedButton(selectedButton)
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
                    room.number.toString().includes(inputText.toLowerCase())
                    && isAvailable(room)
                )
                break
            case RoomButtonType.booked:
                filteredData = roomAll.filter(room =>
                    room.number.toString().includes(inputText.toLowerCase())
                    && !isAvailable(room)
                )
                break
        }
        setFilteredRooms(sortData(filteredData))
        resetPage()
    }
    const sortData = (filteredData: RoomInterfaceBookings[]): RoomInterfaceBookings[] => {
        const arrowStateColumns = Object.keys(arrowStates) as RoomNameColumn[]
        const activeColumn = arrowStateColumns.find(key => arrowStates[key] !== ArrowType.right)
        if (!activeColumn) return filteredData

        const activeColumnArrowDirection = arrowStates[activeColumn]!
        const sortedData = [...filteredData]

        sortedData.sort((a, b) => {
            let valueA: any
            let valueB: any
            switch (activeColumn) {
                case RoomNameColumn.number:
                    valueA = parseInt(a.number)
                    valueB = parseInt(b.number)
                    break
                case RoomNameColumn.type:
                    valueA = a.type.toLowerCase()
                    valueB = b.type.toLowerCase()
                    break
                case RoomNameColumn.price:
                    valueA = a.price
                    valueB = b.price
                    break
                case RoomNameColumn.discount:
                    valueA = a.discount
                    valueB = b.discount
                    break
                default:
                    return 0
            }

            return sortValues(valueA, valueB, activeColumnArrowDirection)
        })

        return sortedData
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
                    <ButtonCreate onClick={() => navigate('room-create')} children='+ New Room' />
                </roomMainStyles.DivCtnButton>
            </roomMainStyles.DivCtnFuncionality>

            <Table rowlistlength={filteredRooms.length + 1} columnlistlength={Object.values(RoomNameColumn).length + 2} >
                <THTable>{''}</THTable>
                {Object.values(RoomNameColumn).map(entry => {
                    if (sortableColumns.includes(entry)) {
                        return (
                            <THTable
                                key={entry}
                                onClick={() => handleColumnClick(entry, sortableColumns, setArrowStates, () => displayRooms())}
                                cursorPointer="yes"
                            >
                                {entry}
                                {getArrowIcon(arrowStates[entry])}
                            </THTable>
                        )
                    }
                    else {
                        return (
                            <THTable key={entry}>
                                {entry}
                            </THTable>
                        )
                    }
                })}
                <THTable>{''}</THTable>
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
                                <ButtonOption onClick={() => { () => navigate(`room-update/${roomData._id}`) }}>Update</ButtonOption>
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