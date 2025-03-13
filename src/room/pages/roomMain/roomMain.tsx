
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as roomMainStyles from "./roomMainStyles.ts"
import { RoomButtonType } from "../../enums/roomButtonType.ts"
import { RoomColumnSort } from '../../enums/roomColumnSort.ts'
import { AppDispatch } from '../../../common/redux/store.ts'
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { RoomInterfaceBookings } from "./../../interfaces/roomInterface.ts"
import { RoomColumnsArrowStatesInterface } from './../../interfaces/roomColumnsArrowStatesInterface.ts'
import { ArrowType } from "../../../common/enums/ArrowType.ts"
import { TableDisplaySelector } from "../../../common/components/tableDisplaySelector/tableDisplaySelector.tsx"
import { TableSearchTerm } from "../../../common/components/tableSearchTerm/tableSearchTerm.tsx"
import { ButtonCreate } from "../../../common/components/buttonCreate/buttonCreate.tsx"
import { applyDiscount } from "../../../common/utils/tableUtils.ts"
import { usePagination } from "../../../common/hooks/usePagination.ts"
import * as paginationJS from '../../../common/styles/pagination.ts'
import {
    Table, THTable, TriangleUp, TriangleRight, TriangleDown, DivImgTable,
    ImgTableRoom, PTable, PStatusRoomList, IconOptions, DivCtnOptions, ButtonOption
} from "../../../common/styles/tableStyles.ts"
import { getRoomAllData, getRoomAllStatus } from "./../../features/roomSlice.ts"
import { RoomFetchAllThunk } from "./../../features/thunks/roomFetchAllThunk.ts"
import { RoomDeleteByIdThunk } from "./../../features/thunks/roomDeleteByIdThunk.ts"
import { getBookingAllData, getBookingAllStatus } from "../../../booking/features/bookingSlice.js"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk.js"
import { BookingInterfaceRoom } from "../../../booking/interfaces/bookingInterface.ts"


export const RoomMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const nameColumnList: string[] = ['', 'Room number', 'Room type', 'Amenities', 'Price', 'Offer price', 'Booking status', '']
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
    const navigateToRoomUpdate = (id: number) => navigate(`room-update/${id}`)

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
        const activeColumn = Object.keys(arrowStates).find(key => arrowStates[key] !== ArrowType.right)
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
    const deleteRoomById = (id: number, index: number): void => {
        // const room = roomAll.find(room => room._id === id)
        // if (room) {
        //     room.booking_data_list.map(booking => {
        //         dispatch(BookingDeleteByIdThunk(booking._id))
        //     })
        // }
        dispatch(RoomDeleteByIdThunk(id))
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
                {nameColumnList.map((nameColumn, index) =>
                    index === 1 || index === 4 || index === 5 ?
                        <THTable key={index} cursorPointer='yes' onClick={() => {
                            switch (index) {
                                case 1: handleColumnClick(RoomColumnSort.roomNumber); break
                                case 4: handleColumnClick(RoomColumnSort.price); break
                                case 5: handleColumnClick(RoomColumnSort.offerPrice); break
                                default: ; break
                            }
                        }}
                        >
                            {nameColumn}
                            {(() => {
                                switch (index) {
                                    case 1: return getArrowIcon(RoomColumnSort.roomNumber)
                                    case 4: return getArrowIcon(RoomColumnSort.price)
                                    case 5: return getArrowIcon(RoomColumnSort.offerPrice)
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