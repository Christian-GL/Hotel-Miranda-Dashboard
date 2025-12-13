
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Swiper, SwiperSlide } from 'swiper/react'

import * as clientMainStyles from "./clientMainStyles"
import { AppDispatch } from '../../../common/redux/store'
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { ClientInterface } from '../../interfaces/clientInterface'
import { getArrowIcon } from "common/utils/getArrowIcon"
import { sortValues } from "common/utils/sortValues"
import { handleColumnClick } from "common/utils/handleColumnClick"
import { ArrowType } from "../../../common/enums/ArrowType"
import { ClientNameColumn } from "../../enums/ClientNameColumn"
import { OptionYesNo } from "common/enums/optionYesNo"
import { ArticleReview } from "../../../common/components/articleReview/articleReview"
import { TableDisplaySelector } from "../../../common/components/tableDisplaySelector/tableDisplaySelector"
import { TableSearchTerm } from "../../../common/components/tableSearchTerm/tableSearchTerm"
import { TablePagination } from "../../../common/components/tablePagination/tablePagination"
import { ButtonCreate } from "../../../common/components/buttonCreate/buttonCreate"
import {
    Table, THTable, TriangleUp, DivNameTable, TriangleRight, TriangleDown, PTable,
    IconPhone, ButtonPublishArchive, IconOptions, DivCtnOptions, ButtonOption
} from "../../../common/styles/tableStyles"
import { usePagination } from "../../../common/hooks/usePagination"
import { getClientAllData, getClientAllStatus } from "../../features/clientSlice"
import { ClientFetchAllThunk } from "../../features/thunks/clientFetchAllThunk"
import { ClientDeleteByIdThunk } from "../../features/thunks/clientDeleteByIdThunk"
import { RoomInterface } from "room/interfaces/roomInterface"
import { getRoomAllData, getRoomAllStatus } from "../../../room/features/roomSlice"
import { RoomFetchAllThunk } from "../../../room/features/thunks/roomFetchAllThunk"
import { BookingInterface } from "../../../booking/interfaces/bookingInterface"
import { getBookingAllData, getBookingAllStatus } from "../../../booking/features/bookingSlice"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk"


export const ClientMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const clientAll: ClientInterface[] = useSelector(getClientAllData)
    const clientAllLoading: ApiStatus = useSelector(getClientAllStatus)
    const bookingAll: BookingInterface[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const roomAll: RoomInterface[] = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [filteredClients, setFilteredClients] = useState<ClientInterface[]>([])
    const sortableColumns: ClientNameColumn[] = [
        ClientNameColumn.customerInfo
    ]
    type ArrowStates = Partial<Record<ClientNameColumn, ArrowType>>
    const [arrowStates, setArrowStates] = useState<ArrowStates>({
        [ClientNameColumn.customerInfo]: ArrowType.down
    })
    const [displayedNotArchived, setDisplayedNotArchived] = useState<OptionYesNo>(OptionYesNo.yes)
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
        else if (clientAllLoading === ApiStatus.fulfilled) { displayClients(displayedNotArchived) }
        else if (clientAllLoading === ApiStatus.rejected) { alert("Error en la api de clientMain > clients") }
    }, [clientAllLoading, clientAll, inputText, displayedNotArchived, arrowStates])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error en la api de clientMain > rooms") }
    }, [roomAllLoading, roomAll])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { }
        else if (bookingAllLoading === ApiStatus.rejected) { alert("Error en la api de clientMain > bookings") }
    }, [bookingAllLoading, bookingAll])

    const handleInputTerm = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (isArchived: OptionYesNo): void => {
        setDisplayedNotArchived(isArchived)
        displayClients(displayedNotArchived)
    }
    const displayClients = (isDisplayedNotArchived: OptionYesNo): void => {
        const selectArchiveType = clientAll.filter(client =>
            client.isArchived !== isDisplayedNotArchived
        )
        const filteredData = selectArchiveType.filter(client =>
            client._id.toLocaleLowerCase().includes(inputText.toLowerCase())
            || client.full_name.toLowerCase().includes(inputText.toLowerCase())
            || client.email.toLocaleLowerCase().includes(inputText.toLowerCase())
        )
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
    // const publish = (id: string) => {
    //     const updatedClient = clientAll.find(client => client._id === id)
    //     if (updatedClient !== undefined) {
    //         const clientUpdated = { ...updatedClient, archived: OptionYesNo.no }
    //         dispatch(ClientUpdateThunk({ idClient: id, updatedClientData: clientUpdated }))
    //     }
    // }

    // const archive = (id: string) => {
    //     const updatedClient = clientAll.find(client => client._id === id)
    //     if (updatedClient !== undefined) {
    //         const clientUpdated = { ...updatedClient, archived: OptionYesNo.yes }
    //         dispatch(ClientUpdateThunk({ idClient: id, updatedClientData: clientUpdated }))
    //     }
    // }
    const displayMenuOptions = (index: number): void => {
        tableOptionsDisplayed === index ?
            setTableOptionsDisplayed(-1) :
            setTableOptionsDisplayed(index)
    }
    const deleteClientById = (id: string, index: number): void => {
        dispatch(ClientDeleteByIdThunk(id))
        displayMenuOptions(index)
        resetPage()
    }
    const getClientBookingRoomsMap = (client: ClientInterface): { bookingId: string; roomNumbers: string[] }[] => {

        return client.booking_id_list.map(bookingId => {
            const booking = bookingAll.find(booking => booking._id === bookingId)
            if (!booking) return null

            const roomNumbers = booking.room_id_list.map(roomId => {
                const room = roomAll.find(room => room._id === roomId)
                return room?.number
            }).filter(Boolean) as string[]

            return { bookingId, roomNumbers }
        }).filter(Boolean) as { bookingId: string; roomNumbers: string[] }[]
    }


    return (
        console.log(filteredClients),
        <clientMainStyles.SectionPageClient>
            <clientMainStyles.SectionReviews>
                <clientMainStyles.DivCtnReviews>
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={filteredClients.length === 1 ? 1 : filteredClients.length === 2 ? 2 : 3}
                        navigation={false}
                        pagination={{ clickable: true }}
                        loop={true}
                    >
                        {/* !!! CAMBIAR POR DATOS RELEVANTES */}
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
                </clientMainStyles.DivCtnReviews>
            </clientMainStyles.SectionReviews>

            <clientMainStyles.DivCtnFuncionality>
                <clientMainStyles.DivCtnTableDisplayFilter>
                    <TableDisplaySelector text='Clients' onClick={() => handleTableFilter(OptionYesNo.yes)} isSelected={displayedNotArchived === OptionYesNo.yes} />
                    <TableDisplaySelector text='Archived' onClick={() => handleTableFilter(OptionYesNo.no)} isSelected={displayedNotArchived === OptionYesNo.no} />
                </clientMainStyles.DivCtnTableDisplayFilter>

                <clientMainStyles.DivCtnSearch>
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search by client ID/name/email' />
                </clientMainStyles.DivCtnSearch>

                <clientMainStyles.DivCtnButton>
                    <ButtonCreate onClick={() => navigate('client-create')} children='+ New Client' />
                </clientMainStyles.DivCtnButton>
            </clientMainStyles.DivCtnFuncionality>

            <Table rowlistlength={filteredClients.length + 1} columnlistlength={Object.values(ClientNameColumn).length + 1} >
                {Object.values(ClientNameColumn).map(entry => {
                    if (sortableColumns.includes(entry)) {
                        return (
                            <THTable
                                key={entry}
                                onClick={() => handleColumnClick(entry, sortableColumns, setArrowStates, () => displayClients(displayedNotArchived))}
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
                                getClientBookingRoomsMap(clientData).length > 0 ?
                                    (getClientBookingRoomsMap(clientData).map(b => (
                                        <p key={b.bookingId}>
                                            <b>#{b.bookingId}</b>: {b.roomNumbers.join(", ")}
                                        </p>
                                    )))
                                    :
                                    (<p>No bookings yet</p>)
                            }
                        </PTable>,

                        // !!! REUTILIZAR AL ACABAR DE ACTUALIZAR EL DASHBOARD:
                        // <PTable key={index + '-3'}>
                        //     {
                        //         clientData.isArchived === OptionYesNo.yes ?
                        //             <ButtonPublishArchive onClick={() => publish(clientData._id)} archived={false}>Publish</ButtonPublishArchive> :
                        //             <ButtonPublishArchive onClick={() => archive(clientData._id)} archived={true}>Archive</ButtonPublishArchive>
                        //     }
                        // </PTable>,

                        <PTable key={index + '-4'}>
                            <IconOptions onClick={() => { displayMenuOptions(index) }} />
                            <DivCtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} isInTable={true} >
                                <ButtonOption onClick={() => { navigate(`client-update/${clientData._id}`) }}>Update</ButtonOption>
                                <ButtonOption onClick={() => { deleteClientById(clientData._id, index) }}>Delete</ButtonOption>
                            </DivCtnOptions>
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

        </clientMainStyles.SectionPageClient >
    )
}