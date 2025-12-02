
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Swiper, SwiperSlide } from 'swiper/react'

import * as clientMainStyles from "./clientMainStyles"
import { ClientColumnSort } from '../../enums/clientColumnSort'
import { AppDispatch } from '../../../common/redux/store'
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { ClientInterface } from '../../interfaces/clientInterface'
import { ClientColumnsArrowStatesInterface } from '../../interfaces/clientColumnsArrowStatesInterface'
import { ArrowType } from "../../../common/enums/ArrowType"
import { formatDateForPrint } from '../../../common/utils/dateUtils'
import { ArticleReview } from "../../../common/components/articleReview/articleReview"
import { TableDisplaySelector } from "../../../common/components/tableDisplaySelector/tableDisplaySelector"
import { TableSearchTerm } from "../../../common/components/tableSearchTerm/tableSearchTerm"
import { ButtonCreate } from "../../../common/components/buttonCreate/buttonCreate"
import {
    Table, THTable, TriangleUp, DivNameTable, TriangleRight, TriangleDown, PTable,
    IconPhone, ButtonPublishArchive, IconOptions, DivCtnOptions, ButtonOption
} from "../../../common/styles/tableStyles"
import { usePagination } from "../../../common/hooks/usePagination"
import * as paginationJS from '../../../common/styles/pagination'
import { getClientAllData, getClientAllStatus } from "../../features/clientSlice"
import { ClientFetchAllThunk } from "../../features/thunks/clientFetchAllThunk"
import { ClientUpdateThunk } from "../../features/thunks/clientUpdateThunk"
import { ClientDeleteByIdThunk } from "../../features/thunks/clientDeleteByIdThunk"
import { OptionYesNo } from "common/enums/optionYesNo"


export const ClientMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const nameColumnList: string[] = ['Order ID', 'Publish date', 'Customer', 'Comment', 'Action', '']
    const clientAll: ClientInterface[] = useSelector(getClientAllData)
    const clientAllLoading: ApiStatus = useSelector(getClientAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [filteredClients, setFilteredClients] = useState<ClientInterface[]>([])
    const [displayedNotArchived, setDisplayedNotArchived] = useState<OptionYesNo>(OptionYesNo.yes)
    const [arrowStates, setArrowStates] = useState<ClientColumnsArrowStatesInterface>({
        orderId: ArrowType.right,
        date: ArrowType.down,
        customer: ArrowType.right
    })
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
        else if (clientAllLoading === ApiStatus.rejected) { alert("Error en la api de clients") }
    }, [clientAllLoading, clientAll, inputText, displayedNotArchived, arrowStates])

    const navigateToClientCreate = () => navigate('client-create')
    const navigateToClientUpdate = (id: string) => navigate(`client-update/${id}`)

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
            client.full_name.toLowerCase().includes(inputText.toLowerCase())
        )
        const sortedData = sortData(filteredData)
        setFilteredClients(sortedData)
        resetPage()
    }
    const sortData = (filteredData: ClientInterface[]): ClientInterface[] => {
        // !!! OPTIMIZAR LA SIGUIENTE LINEA:
        const activeColumn = (Object.keys(arrowStates) as (keyof ClientColumnsArrowStatesInterface)[]).find(key => arrowStates[key] !== ArrowType.right)
        let sortedData: ClientInterface[] = [...filteredData]
        if (activeColumn) {
            if (activeColumn === ClientColumnSort.orderId) {
                sortedData.sort((a, b) => {
                    let valueA: string = a._id
                    let valueB: string = b._id
                    if (arrowStates[activeColumn] === ArrowType.up) {
                        return valueB > valueA ? 1 : (valueB < valueA ? -1 : 0)
                    } else {
                        return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
                    }
                })
            }
            // !!! Antigua validación por fecha:
            // else if (activeColumn === ClientColumnSort.date) {
            //     sortedData.sort((a, b) => {
            //         let valueA: Date = new Date(a.publish_date)
            //         let valueB: Date = new Date(b.publish_date)
            //         if (arrowStates[activeColumn] === ArrowType.up) {
            //             return valueB > valueA ? 1 : (valueB < valueA ? -1 : 0)
            //         } else {
            //             return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
            //         }
            //     })
            // }
            else if (activeColumn === ClientColumnSort.customer) {
                sortedData.sort((a, b) => {
                    let valueA: string = a.full_name.toLowerCase()
                    let valueB: string = b.full_name.toLowerCase()
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
    const handleColumnClick = (nameColumn: ClientColumnSort): void => {
        setArrowStates(prevState => {
            const newState = { ...prevState }

            if (newState[nameColumn] === ArrowType.right) { newState[nameColumn] = ArrowType.down }
            else if (newState[nameColumn] === ArrowType.down) { newState[nameColumn] = ArrowType.up }
            else if (newState[nameColumn] === ArrowType.up) { newState[nameColumn] = ArrowType.down }

            Object.keys(newState as ClientColumnsArrowStatesInterface).forEach((key) => {
                const typedKey = key as keyof ClientColumnsArrowStatesInterface

                if (typedKey !== nameColumn) {
                    newState[typedKey] = ArrowType.right
                }
            })

            return newState
        })

        handleTableFilter(displayedNotArchived)
    }
    const getArrowIcon = (nameColumn: ClientColumnSort): JSX.Element => {
        const state = arrowStates[nameColumn]
        if (state === ArrowType.up) { return <TriangleUp /> }
        else if (state === ArrowType.down) { return <TriangleDown /> }
        else { return <TriangleRight /> }
    }
    const publish = (id: string) => {
        const updatedClient = clientAll.find(client => client._id === id)
        if (updatedClient !== undefined) {
            const clientUpdated = { ...updatedClient, archived: OptionYesNo.no }
            dispatch(ClientUpdateThunk({ idClient: id, updatedClientData: clientUpdated }))
        }
    }
    const archive = (id: string) => {
        const updatedClient = clientAll.find(client => client._id === id)
        if (updatedClient !== undefined) {
            const clientUpdated = { ...updatedClient, archived: OptionYesNo.yes }
            dispatch(ClientUpdateThunk({ idClient: id, updatedClientData: clientUpdated }))
        }
    }
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

    return (
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
                        {/* !!! CAMBIAR EL EMAIL Y EL FULL_NAME POR DATOS RELEVANTES */}
                        {currentPageItems.map((client: ClientInterface, index: number) => {
                            return <SwiperSlide key={index}>
                                <ArticleReview
                                    nameProfile={client.full_name}
                                    timeSince={`${formatDateForPrint(client.email)}`}
                                    textReview={client.full_name}
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
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search by client name' />
                </clientMainStyles.DivCtnSearch>

                <clientMainStyles.DivCtnButton>
                    <ButtonCreate onClick={navigateToClientCreate} children='+ New Client' />
                </clientMainStyles.DivCtnButton>
            </clientMainStyles.DivCtnFuncionality>

            <Table rowlistlength={filteredClients.length + 1} columnlistlength={nameColumnList.length} >
                {nameColumnList.map((nameColumn, index) =>
                    index <= 2 ?
                        <THTable key={index} cursorPointer='yes' onClick={() => {
                            switch (index) {
                                case 0: handleColumnClick(ClientColumnSort.orderId); break
                                case 1: handleColumnClick(ClientColumnSort.date); break
                                case 2: handleColumnClick(ClientColumnSort.customer); break
                                default: ; break
                            }
                        }}
                        >
                            {nameColumn}
                            {(() => {
                                switch (index) {
                                    case 0: return getArrowIcon(ClientColumnSort.orderId)
                                    case 1: return getArrowIcon(ClientColumnSort.date)
                                    case 2: return getArrowIcon(ClientColumnSort.customer)
                                    default: return null
                                }
                            })()}
                        </THTable> :
                        <THTable key={index}>{nameColumn}</THTable>
                )}
                {currentPageItems.map((clientData, index) => {
                    return [
                        <PTable key={index + '-1'}>
                            #<b>{clientData._id}</b>
                        </PTable>,

                        <PTable key={index + '-2'} flexdirection='column' alignitems='left' justifycontent='center'>
                            <DivNameTable>
                                <b>{clientData.full_name}</b>
                            </DivNameTable>
                            <div>{clientData.email}</div>
                            <div style={{ display: 'flex', alignItems: 'bottom' }}>
                                <IconPhone width='1.3rem' />
                                <div>{clientData.phone_number}</div>
                            </div>
                        </PTable>,

                        <PTable key={index + '-3'} >
                            {clientData.booking_id_list}
                        </PTable>,

                        <PTable key={index + '-4'}>
                            {
                                clientData.isArchived === OptionYesNo.yes ?
                                    <ButtonPublishArchive onClick={() => publish(clientData._id)} archived={false}>Publish</ButtonPublishArchive> :
                                    <ButtonPublishArchive onClick={() => archive(clientData._id)} archived={true}>Archive</ButtonPublishArchive>
                            }
                        </PTable>,

                        <PTable key={index + '-5'}>
                            <IconOptions onClick={() => { displayMenuOptions(index) }} />
                            <DivCtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} isInTable={true} >
                                <ButtonOption onClick={() => { navigateToClientUpdate(clientData._id) }}>Update</ButtonOption>
                                <ButtonOption onClick={() => { deleteClientById(clientData._id, index) }}>Delete</ButtonOption>
                            </DivCtnOptions>
                        </PTable>
                    ]
                })}
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

        </clientMainStyles.SectionPageClient >
    )
}