
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import { SectionPage, CtnFuncionality, CtnAllDisplayFilter, CtnTableDisplayFilter, CtnSearch, CtnButton } from "../../../common/styles/funcionalityStyles"
import { useLoginOptionsContext } from "../../../signIn/features/loginProvider"
import { ArchivedButtonType } from "../../../common/enums/archivedButtonType"
import { RoomButtonType } from "../../enums/roomButtonType"
import { AppDispatch } from '../../../common/redux/store'
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { Role } from "../../../user/enums/role"
import { RoomInterface } from "./../../interfaces/roomInterface"
import { getArrowIcon } from "common/utils/getArrowIcon"
import { sortValues } from "common/utils/sortValues"
import { handleColumnClick } from "common/utils/handleColumnClick"
import { handleNonAdminClick } from 'common/utils/nonAdminPopupMessage'
import { ArrowType } from "../../../common/enums/ArrowType"
import { OptionYesNo } from "common/enums/optionYesNo"
import { RoomNameColumn } from "../../enums/roomNameColumn"
import { PopupText } from "../../../common/components/popupText/popupText"
import { PopupTextInterface } from '../../../common/interfaces/popupTextInterface'
import { TableDisplaySelector } from "../../../common/components/tableDisplaySelector/tableDisplaySelector"
import { TableSearchTerm } from "../../../common/components/tableSearchTerm/tableSearchTerm"
import { TablePagination } from "../../../common/components/tablePagination/tablePagination"
import { ButtonCreate } from "../../../common/components/buttonCreate/buttonCreate"
import { applyDiscount } from "../../../common/utils/tableUtils"
import { usePagination } from "../../../common/hooks/usePagination"
import {
    Table, THTable, TriangleUp, TriangleRight, TriangleDown, DivImgTable,
    ImgTableRoom, PTable, PStatusRoomList, IconOptions, DivCtnOptions, ButtonOption
} from "../../../common/styles/tableStyles"
import { getRoomAllData, getRoomAllStatus } from "./../../features/roomSlice"
import { RoomFetchAllThunk } from "./../../features/thunks/roomFetchAllThunk"
import { RoomUpdateThunk } from "./../../features/thunks/roomUpdateThunk"
import { RoomDeleteByIdThunk } from "./../../features/thunks/roomDeleteByIdThunk"
import { getBookingAllData, getBookingAllStatus, deleteBooking } from "../../../booking/features/bookingSlice"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk"
import { BookingInterface } from "../../../booking/interfaces/bookingInterface"


export const RoomMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { getRole } = useLoginOptionsContext()
    const roomAll: RoomInterface[] = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const bookingAll: BookingInterface[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [archivedFilterButton, setArchivedFilterButton] = useState<ArchivedButtonType>(ArchivedButtonType.all)
    const [filteredRooms, setFilteredRooms] = useState<RoomInterface[]>([])
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
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [infoPopup, setInfoPopup] = useState<PopupTextInterface>({ title: '', text: '' })
    const {
        currentPageItems,
        currentPage,
        totalPages,
        goToNextPage,
        goToPrevPage,
        resetPage,
        lastPage
    } = usePagination<RoomInterface>(filteredRooms, 10)

    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { displayRooms() }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error en la api de roomMain > rooms") }
    }, [roomAllLoading, roomAll, inputText, selectedButton, archivedFilterButton, arrowStates])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { }
        else if (bookingAllLoading === ApiStatus.rejected) { alert("Error en la api de roomMain > bookings") }
    }, [bookingAllLoading, bookingAll])

    const filterByRoomNumber = (rooms: RoomInterface[], searchText: string): RoomInterface[] => {
        return rooms.filter(room =>
            room.number.toString().includes(searchText.toLowerCase())
        )
    }
    const filterByArchivedStatus = (rooms: RoomInterface[], archivedFilterButton: ArchivedButtonType): RoomInterface[] => {
        switch (archivedFilterButton) {
            case ArchivedButtonType.archived:
                return rooms.filter(room => room.isArchived === OptionYesNo.yes)

            case ArchivedButtonType.notArchived:
                return rooms.filter(room => room.isArchived === OptionYesNo.no)

            case ArchivedButtonType.all:
            default:
                return rooms
        }
    }
    const displayRooms = (): void => {
        let filteredData = roomAll

        filteredData = filterByRoomNumber(filteredData, inputText)
        filteredData = filterByArchivedStatus(filteredData, archivedFilterButton)

        setFilteredRooms(sortData(filteredData))
        resetPage()
    }
    const sortData = (filteredData: RoomInterface[]): RoomInterface[] => {
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
    const toggleArchivedClient = (id: string, room: RoomInterface, index: number): void => {
        const updatedUser = {
            ...room,
            isArchived: room.isArchived === OptionYesNo.no
                ? OptionYesNo.yes
                : OptionYesNo.no
        }
        dispatch(RoomUpdateThunk({ idRoom: id, updatedRoomData: updatedUser }))
        displayMenuOptions(index)
        resetPage()
    }
    const deleteRoomById = (id: string, index: number): void => {
        dispatch(RoomDeleteByIdThunk(id))
        displayMenuOptions(index)
        resetPage()
    }
    const isAvailable = (room: RoomInterface): boolean => {
        // !!! USAR DATOS ASOCIADOS DE LAS BOOKINGS
        // return !Array.isArray(room.booking_id_list) ||
        //     room.booking_id_list.length === 0 ||
        //     !room.booking_id_list.some(booking => {
        //         const actualDate = new Date()
        //         const checkIn = new Date(booking.check_in_date)
        //         const checkOut = new Date(booking.check_out_date)
        //         return actualDate >= checkIn && actualDate <= checkOut
        //     })
        return false
    }


    return (
        <SectionPage>

            <CtnFuncionality>
                <CtnAllDisplayFilter>
                    {/* !!! AÑADIR FILTRO: */}
                    <CtnTableDisplayFilter>
                        {/* <TableDisplaySelector text='All Rooms' onClick={() => handleTableFilter(RoomButtonType.all)} isSelected={selectedButton === RoomButtonType.all} />
                        <TableDisplaySelector text='Available Rooms' onClick={() => handleTableFilter(RoomButtonType.available)} isSelected={selectedButton === RoomButtonType.available} />
                        <TableDisplaySelector text='Booked Rooms' onClick={() => handleTableFilter(RoomButtonType.booked)} isSelected={selectedButton === RoomButtonType.booked} /> */}
                    </CtnTableDisplayFilter>
                    <CtnTableDisplayFilter>
                        <TableDisplaySelector text='All Rooms' onClick={() => setArchivedFilterButton(ArchivedButtonType.all)} isSelected={archivedFilterButton === ArchivedButtonType.all} />
                        <TableDisplaySelector text='Not Archived' onClick={() => setArchivedFilterButton(ArchivedButtonType.notArchived)} isSelected={archivedFilterButton === ArchivedButtonType.notArchived} />
                        <TableDisplaySelector text='Archived' onClick={() => setArchivedFilterButton(ArchivedButtonType.archived)} isSelected={archivedFilterButton === ArchivedButtonType.archived} />
                    </CtnTableDisplayFilter>
                </CtnAllDisplayFilter>

                <CtnSearch>
                    <TableSearchTerm
                        onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setInputText(e.target.value)
                            resetPage()
                        }}
                        placeholder="Search by room number"
                    />
                </CtnSearch>

                <CtnButton>
                    <ButtonCreate onClick={getRole() === Role.admin ? () => navigate('room-create') : () => handleNonAdminClick(setInfoPopup, setShowPopup)}>
                        + New Room
                    </ButtonCreate>
                </CtnButton>
            </CtnFuncionality>

            {showPopup && <PopupText isSlider={false} title={infoPopup.title} text={infoPopup.text} onClose={() => setShowPopup(false)} />}

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
                                <ButtonOption onClick={() => { navigate(`room-update/${roomData._id}`) }}>Update</ButtonOption>
                                <ButtonOption onClick={() => toggleArchivedClient(roomData._id, roomData, index)}>
                                    {roomData.isArchived === OptionYesNo.no ? 'Archive' : 'Unarchive'}
                                </ButtonOption>
                                <ButtonOption
                                    onClick={getRole() === Role.admin
                                        ? () => { deleteRoomById(roomData._id, index) }
                                        : () => handleNonAdminClick(setInfoPopup, setShowPopup)}
                                    disabledClick={getRole() !== Role.admin}
                                >Delete
                                </ButtonOption>
                            </DivCtnOptions>
                        </PTable>
                    ]
                }
                )}
            </Table>

            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onReset={resetPage}
                onPrev={goToPrevPage}
                onNext={goToNextPage}
                onLast={lastPage}
            />
        </SectionPage>
    )
}