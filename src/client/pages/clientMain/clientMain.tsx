
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Swiper, SwiperSlide } from 'swiper/react'

import * as clientMainStyles from "./clientMainStyles"
import { SectionPage, CtnFuncionality, CtnAllDisplayFilter, CtnTableDisplayFilter, CtnSearch, CtnButton } from "../../../common/styles/funcionalityStyles"
import { useLoginOptionsContext } from "../../../signIn/features/loginProvider"
import { ArchivedButtonType } from "../../../common/enums/archivedButtonType"
import { AppDispatch } from '../../../common/redux/store'
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { Role } from "../../../user/enums/role"
import { ClientInterface } from '../../interfaces/clientInterface'
import { getArrowIcon } from "common/utils/getArrowIcon"
import { sortValues } from "common/utils/sortValues"
import { handleColumnClick } from "common/utils/handleColumnClick"
import { handleNonAdminClick } from 'common/utils/nonAdminPopupMessage'
import { customPopupMessage } from 'common/utils/customPopupMessage'
import { getClientBookingsByRoom } from "../../../common/utils/clientBookingsByRoom"
import { ArrowType } from "../../../common/enums/ArrowType"
import { ClientNameColumn } from "../../enums/ClientNameColumn"
import { PopupText } from "../../../common/components/popupText/popupText"
import { PopupTextInterface } from '../../../common/interfaces/popupTextInterface'
import { OptionYesNo } from "common/enums/optionYesNo"
import { ArticleReview } from "../../../common/components/articleReview/articleReview"
import { TableDisplaySelector } from "../../../common/components/tableDisplaySelector/tableDisplaySelector"
import { TableSearchTerm } from "../../../common/components/tableSearchTerm/tableSearchTerm"
import { TablePagination } from "../../../common/components/tablePagination/tablePagination"
import { ButtonCreate } from "../../../common/components/buttonCreate/buttonCreate"
import {
    Table, THTable, TriangleUp, DivNameTable, TriangleRight, TriangleDown, PTable, PStatusAvailableUsers,
    IconPhone, ButtonPublishArchive, CtnMenuOptions, IconOptions, CtnOptionsDisplayed, ButtonOption
} from "../../../common/styles/tableStyles"
import { usePagination } from "../../../common/hooks/usePagination"
import { getClientAllData, getClientAllStatus, getClientErrorMessage } from "../../features/clientSlice"
import { ClientFetchAllThunk } from "../../features/thunks/clientFetchAllThunk"
import { ClientUpdateThunk } from "./../../features/thunks/clientUpdateThunk"
import { ClientDeleteByIdThunk } from "../../features/thunks/clientDeleteByIdThunk"
import { RoomInterface } from "room/interfaces/roomInterface"
import { getRoomAllData, getRoomAllStatus, getRoomErrorMessage } from "../../../room/features/roomSlice"
import { RoomFetchAllThunk } from "../../../room/features/thunks/roomFetchAllThunk"
import { BookingInterface } from "../../../booking/interfaces/bookingInterface"
import { getBookingAllData, getBookingAllStatus, getBookingErrorMessage } from "../../../booking/features/bookingSlice"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk"


export const ClientMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { getRole } = useLoginOptionsContext()
    const clientAll: ClientInterface[] = useSelector(getClientAllData)
    const clientAllLoading: ApiStatus = useSelector(getClientAllStatus)
    const clientErrorMessage = useSelector(getClientErrorMessage)
    const bookingAll: BookingInterface[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const bookingErrorMessage = useSelector(getBookingErrorMessage)
    const roomAll: RoomInterface[] = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const roomErrorMessage = useSelector(getRoomErrorMessage)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [archivedFilterButton, setArchivedFilterButton] = useState<ArchivedButtonType>(ArchivedButtonType.notArchived)
    const [filteredClients, setFilteredClients] = useState<ClientInterface[]>([])
    const sortableColumns: ClientNameColumn[] = [
        ClientNameColumn.customerInfo
    ]
    type ArrowStates = Partial<Record<ClientNameColumn, ArrowType>>
    const [arrowStates, setArrowStates] = useState<ArrowStates>({
        [ClientNameColumn.customerInfo]: ArrowType.down
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
    } = usePagination<ClientInterface>(filteredClients, 10)

    useEffect(() => {
        if (clientAllLoading === ApiStatus.idle) { dispatch(ClientFetchAllThunk()) }
        else if (clientAllLoading === ApiStatus.fulfilled) { displayClients() }
        else if (clientAllLoading === ApiStatus.rejected && clientErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', clientErrorMessage) }
    }, [clientAllLoading, clientAll, inputText, archivedFilterButton, arrowStates])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected && roomErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', roomErrorMessage) }
    }, [roomAllLoading, roomAll])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { }
        else if (bookingAllLoading === ApiStatus.rejected && bookingErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', bookingErrorMessage) }
    }, [bookingAllLoading, bookingAll])

    const filterByName = (clients: ClientInterface[], searchText: string): ClientInterface[] => {
        const normalizedText = searchText.toLowerCase()
        return clients.filter(client =>
            client._id.toLocaleLowerCase().includes(normalizedText)
            || client.full_name.toLowerCase().includes(normalizedText)
            || client.email.toLocaleLowerCase().includes(normalizedText)
        )
    }
    const filterByArchivedStatus = (clients: ClientInterface[], archivedFilterButton: ArchivedButtonType): ClientInterface[] => {
        switch (archivedFilterButton) {
            case ArchivedButtonType.archived:
                return clients.filter(client => client.isArchived === OptionYesNo.yes)

            case ArchivedButtonType.notArchived:
                return clients.filter(client => client.isArchived === OptionYesNo.no)

            case ArchivedButtonType.all:
            default:
                return clients
        }
    }
    const displayClients = (): void => {
        let filteredData = clientAll

        filteredData = filterByName(filteredData, inputText)
        filteredData = filterByArchivedStatus(filteredData, archivedFilterButton)

        setFilteredClients(sortData(filteredData))
        resetPage()
    }
    const sortData = (filteredData: ClientInterface[]): ClientInterface[] => {
        const arrowStateColumns = Object.keys(arrowStates) as ClientNameColumn[]
        const activeColumn = arrowStateColumns.find(key => arrowStates[key] !== ArrowType.right)
        if (!activeColumn) return filteredData

        const activeColumnArrowDirection = arrowStates[activeColumn]!
        const sortedData = [...filteredData]

        sortedData.sort((a, b) => {
            let valueA: any
            let valueB: any
            switch (activeColumn) {
                case ClientNameColumn.customerInfo:
                    valueA = a.full_name.toLowerCase()
                    valueB = b.full_name.toLowerCase()
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
    const toggleArchivedClient = async (id: string, client: ClientInterface, index: number): Promise<void> => {
        const updatedClient = {
            ...client,
            isArchived: client.isArchived === OptionYesNo.no
                ? OptionYesNo.yes
                : OptionYesNo.no
        }
        try {
            await dispatch(ClientUpdateThunk({ idClient: id, updatedClientData: updatedClient })).unwrap()
            displayMenuOptions(index)
            resetPage()
        }
        catch (error) {
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', String(error))
        }
    }
    const deleteClientById = async (id: string, index: number): Promise<void> => {
        try {
            await dispatch(ClientDeleteByIdThunk(id)).unwrap()
            displayMenuOptions(index)
            resetPage()
        }
        catch (error) {
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', String(error))
        }
    }


    return (
        <SectionPage>
            {/* !!! ACTUALIZAR Y REUTILIZAR: */}
            <clientMainStyles.SectionReviews>
                {/* <clientMainStyles.DivCtnReviews>
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={filteredClients.length === 1 ? 1 : filteredClients.length === 2 ? 2 : 3}
                        navigation={false}
                        pagination={{ clickable: true }}
                        loop={true}
                    >
                        {currentPageItems.map((client: ClientInterface, index: number) => {
                            return <SwiperSlide key={index}>
                                <ArticleReview
                                    title={client.full_name}
                                    subTittle={client.email}
                                    content={client.phone_number}
                                />
                            </SwiperSlide>
                        })}
                    </Swiper>
                </clientMainStyles.DivCtnReviews> */}
            </clientMainStyles.SectionReviews>

            <CtnFuncionality>
                <CtnAllDisplayFilter>
                    <CtnTableDisplayFilter>
                        <TableDisplaySelector text='All Clients' onClick={() => setArchivedFilterButton(ArchivedButtonType.all)} isSelected={archivedFilterButton === ArchivedButtonType.all} />
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
                        placeholder='Search by client ID/name/email' />
                </CtnSearch>

                <CtnButton>
                    <ButtonCreate onClick={() => navigate('client-create')} children='+ New Client' />
                </CtnButton>
            </CtnFuncionality>

            {showPopup && <PopupText isSlider={false} title={infoPopup.title} text={infoPopup.text} onClose={() => setShowPopup(false)} />}

            <Table rowlistlength={filteredClients.length + 1} columnlistlength={Object.values(ClientNameColumn).length + 1} >
                {Object.values(ClientNameColumn).map(entry => {
                    if (sortableColumns.includes(entry)) {
                        return (
                            <THTable
                                key={entry}
                                onClick={() => handleColumnClick(entry, sortableColumns, setArrowStates, () => displayClients())}
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
                {currentPageItems.map((clientData, index) => {
                    const clientBookingsByRoom = getClientBookingsByRoom(clientData, bookingAll, roomAll)
                    return [
                        <PTable key={index + '-1'} flexdirection='column' alignitems='left' justifycontent='center'>
                            <DivNameTable>
                                <b>{clientData.full_name}</b>
                            </DivNameTable>
                            <div>{clientData.email}</div>
                            <div>#<b>{clientData._id}</b></div>
                        </PTable>,

                        <PTable key={index + '-2'} >
                            <IconPhone />
                            {clientData.phone_number}
                        </PTable>,

                        <PTable>
                            {
                                clientBookingsByRoom.length > 0 ? (
                                    clientBookingsByRoom.map(booking => (
                                        <p key={booking.bookingId}>
                                            {booking.roomNumbers.join(', ')}
                                        </p>
                                    ))
                                ) : (
                                    <p>No bookings yet</p>
                                )
                            }
                        </PTable>,

                        <PTable key={index + '3'}>
                            {clientData.isArchived === OptionYesNo.no
                                ? <PStatusAvailableUsers active={true}>Active</PStatusAvailableUsers>
                                : <PStatusAvailableUsers active={false}>Archived</PStatusAvailableUsers>
                            }
                        </PTable>,

                        <PTable key={index + '-4'} justifycontent="flex-end">
                            <CtnMenuOptions>
                                <IconOptions onClick={() => { displayMenuOptions(index) }} />
                                <CtnOptionsDisplayed display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} isInTable={true} >
                                    <ButtonOption onClick={() => navigate(`client-update/${clientData._id}`)}>Update</ButtonOption>
                                    <ButtonOption onClick={() => toggleArchivedClient(clientData._id, clientData, index)}>
                                        {clientData.isArchived === OptionYesNo.no ? 'Archive' : 'Unarchive'}
                                    </ButtonOption>
                                    <ButtonOption
                                        onClick={getRole() === Role.admin
                                            ? () => { deleteClientById(clientData._id, index) }
                                            : () => handleNonAdminClick(setInfoPopup, setShowPopup)}
                                        disabledClick={getRole() !== Role.admin}
                                    >Delete
                                    </ButtonOption>
                                </CtnOptionsDisplayed>
                            </CtnMenuOptions>
                        </PTable>
                    ]
                })}
            </Table>

            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onReset={resetPage}
                onPrev={goToPrevPage}
                onNext={goToNextPage}
                onLast={lastPage}
            />

        </SectionPage >
    )
}