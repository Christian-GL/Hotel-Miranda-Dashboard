
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Swiper, SwiperSlide } from 'swiper/react'

import * as contactStyles from "./contactStyles.ts"
import { AppDispatch } from '../common/redux/store.ts'
import { ApiStatus } from "../common/enums/ApiStatus.ts"
import { ContactInterface } from './interfaces/contactInterface.ts'
import { ContactColumnsArrowStatesInterface } from './interfaces/contactColumnsArrowStatesInterface.ts'
import { ArrowType } from "../common/enums/ArrowType.ts"
import { dateFormatToYYYYMMDD, hourFormatTo24H } from "../common/utils/formUtils.ts"
import { ArticleReview } from "../common/components/articleReview/articleReview.tsx"
import { TableDisplayIndicator } from "../common/components/tableDisplaySelector/tableDisplaySelector.tsx"
import { TableSearchTerm } from "../common/components/tableSearchTerm/tableSearchTerm.tsx"
import { ButtonCreate } from "../common/components/buttonCreate/buttonCreate.tsx"
import {
    Table, THTable, TriangleUp, DivNameTable, TriangleRight, TriangleDown, PTable,
    IconPhone, ButtonPublishArchive, IconOptions, DivCtnOptions, ButtonOption
} from "../common/styles/tableStyles.ts"
import { usePagination } from "../common/hooks/usePagination.ts"
import * as paginationJS from '../common/styles/pagination.ts'
import { getContactAllData, getContactAllStatus } from "./features/contactSlice.ts"
import { ContactFetchAllThunk } from "./features/thunks/contactFetchAllThunk.ts"
import { ContactUpdateThunk } from "./features/thunks/contactUpdateThunk.ts"
import { ContactDeleteByIdThunk } from "./features/thunks/contactDeleteByIdThunk.ts"


export const Contact = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    enum columnsSortAvailable {
        orderId = 'orderId',
        date = 'date',
        customer = 'customer'
    }
    const nameColumnList: string[] = ['Order ID', 'Publish date', 'Customer', 'Comment', 'Action', '']
    const contactAll: ContactInterface[] = useSelector(getContactAllData)
    const contactAllLoading: ApiStatus = useSelector(getContactAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [filteredContacts, setFilteredContacts] = useState<ContactInterface[]>([])
    const [selectedButton, setSelectedButton] = useState<boolean>(true)
    const [arrowStates, setArrowStates] = useState<ContactColumnsArrowStatesInterface>({
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
    } = usePagination<ContactInterface>(filteredContacts, 10)

    useEffect(() => {
        if (contactAllLoading === ApiStatus.idle) { dispatch(ContactFetchAllThunk()) }
        else if (contactAllLoading === ApiStatus.fulfilled) { displayContacts(selectedButton) }
        else if (contactAllLoading === ApiStatus.rejected) { alert("Error en la api de contacts") }
    }, [contactAllLoading, contactAll, inputText, selectedButton, arrowStates])

    const navigateToContactCreate = () => navigate('contact-create')
    const navigateToContactUpdate = (id: string) => navigate(`contact-update/${id}`)

    const handleInputTerm = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (): void => {
        setSelectedButton(!selectedButton)
        displayContacts(selectedButton)
    }
    const displayContacts = (archived: boolean): void => {
        const selectArchiveType = contactAll.filter(contact =>
            contact.archived === archived
        )
        const filteredData = selectArchiveType.filter(contact =>
            contact.full_name.toLowerCase().includes(inputText.toLowerCase())
        )
        const sortedData = sortData(filteredData)
        setFilteredContacts(sortedData)
        resetPage()
    }
    const sortData = (filteredData: ContactInterface[]): ContactInterface[] => {
        const activeColumn = Object.keys(arrowStates).find(key => arrowStates[key] !== ArrowType.right)
        let sortedData: ContactInterface[] = [...filteredData]
        if (activeColumn) {

            if (activeColumn === columnsSortAvailable.orderId) {
                sortedData.sort((a, b) => {
                    let valueA: string = a._id.toLowerCase()
                    let valueB: string = b._id.toLowerCase()
                    if (arrowStates[activeColumn] === ArrowType.up) {
                        return valueB > valueA ? 1 : (valueB < valueA ? -1 : 0)
                    } else {
                        return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
                    }
                })
            }
            else if (activeColumn === columnsSortAvailable.date) {
                sortedData.sort((a, b) => {
                    let valueA: Date = new Date(a.publish_date)
                    let valueB: Date = new Date(b.publish_date)
                    if (arrowStates[activeColumn] === ArrowType.up) {
                        return valueB > valueA ? 1 : (valueB < valueA ? -1 : 0)
                    } else {
                        return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
                    }
                })
            }
            else if (activeColumn === columnsSortAvailable.customer) {
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
    const handleColumnClick = (nameColumn: columnsSortAvailable): void => {
        setArrowStates(prevState => {
            const newState = { ...prevState }

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

        handleTableFilter()
    }
    const getArrowIcon = (nameColumn: columnsSortAvailable): JSX.Element => {
        const state = arrowStates[nameColumn]
        if (state === ArrowType.up) { return <TriangleUp /> }
        else if (state === ArrowType.down) { return <TriangleDown /> }
        else { return <TriangleRight /> }
    }
    const publish = (id: string) => {
        const contactUpdated = contactAll.find(contact => contact._id === id)
        if (contactUpdated !== undefined) {
            const updatedContact = { ...contactUpdated, archived: false }
            dispatch(ContactUpdateThunk({ idContact: id, updatedContactData: updatedContact }))
        }
    }
    const archive = (id: string) => {
        // if (notArchived.some(contact => contact._id === id)) {
        //     dispatch(archiveContact(id))
        // }
    }
    const displayMenuOptions = (index: number): void => {
        tableOptionsDisplayed === index ?
            setTableOptionsDisplayed(-1) :
            setTableOptionsDisplayed(index)
    }
    const deleteContactById = (id: string, index: number): void => {
        dispatch(ContactDeleteByIdThunk(id))
        displayMenuOptions(index)
        resetPage()
    }

    return (
        <contactStyles.SectionPageContact>
            <contactStyles.SectionReviews>
                <contactStyles.DivCtnReviews>
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={filteredContacts.length === 1 ? 1 : filteredContacts.length === 2 ? 2 : 3}
                        navigation={false}
                        pagination={{ clickable: true }}
                        loop={true}
                    >
                        {currentPageItems.map((contact: ContactInterface, index: number) => {
                            return <SwiperSlide key={index}>
                                <ArticleReview
                                    nameProfile={contact.full_name}
                                    timeSince={`${contact.publish_date}`}
                                    textReview={contact.comment}
                                />
                            </SwiperSlide>
                        })}
                    </Swiper>
                </contactStyles.DivCtnReviews>
            </contactStyles.SectionReviews>

            <contactStyles.DivCtnFuncionality>
                <contactStyles.DivCtnTableDisplayFilter>
                    <TableDisplayIndicator text='Contacts' onClick={() => handleTableFilter()} isSelected={selectedButton} />
                    <TableDisplayIndicator text='Archived' onClick={() => handleTableFilter()} isSelected={!selectedButton} />
                </contactStyles.DivCtnTableDisplayFilter>

                <contactStyles.DivCtnSearch>
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search by contact name' />
                </contactStyles.DivCtnSearch>

                <contactStyles.DivCtnButton>
                    <ButtonCreate onClick={navigateToContactCreate} children='+ New Contact' />
                </contactStyles.DivCtnButton>
            </contactStyles.DivCtnFuncionality>

            <Table rowlistlength={filteredContacts.length + 1} columnlistlength={nameColumnList.length} >
                {nameColumnList.map((nameColumn, index) =>
                    index <= 2 ?
                        <THTable key={index} cursorPointer='yes' onClick={() => {
                            switch (index) {
                                case 0: handleColumnClick(columnsSortAvailable.orderId); break
                                case 1: handleColumnClick(columnsSortAvailable.date); break
                                case 2: handleColumnClick(columnsSortAvailable.customer); break
                                default: ; break
                            }
                        }}
                        >
                            {nameColumn}
                            {(() => {
                                switch (index) {
                                    case 0: return getArrowIcon(columnsSortAvailable.orderId)
                                    case 1: return getArrowIcon(columnsSortAvailable.date)
                                    case 2: return getArrowIcon(columnsSortAvailable.customer)
                                    default: return null
                                }
                            })()}
                        </THTable> :
                        <THTable key={index}>{nameColumn}</THTable>
                )}
                {currentPageItems.map((contactData, index) => {
                    return [
                        <PTable key={index + '-1'}>
                            #<b>{contactData._id}</b>
                        </PTable>,

                        <PTable key={index + '-2'} >
                            {contactData.publish_date}
                        </PTable>,

                        <PTable key={index + '-3'} flexdirection='column' alignitems='left' justifycontent='center'>
                            <DivNameTable>
                                <b>{contactData.full_name}</b>
                            </DivNameTable>
                            <div>{contactData.email}</div>
                            <div style={{ display: 'flex', alignItems: 'bottom' }}>
                                <IconPhone width='1.3rem' />
                                <div>{contactData.phone_number}</div>
                            </div>
                        </PTable>,

                        <PTable key={index + '-4'} >
                            {contactData.comment}
                        </PTable>,

                        <PTable key={index + '-5'}>
                            {
                                contactData.archived ?
                                    <ButtonPublishArchive onClick={() => archive(contactData._id)} archived={true}>Archive</ButtonPublishArchive> :
                                    <ButtonPublishArchive onClick={() => publish(contactData._id)} archived={false}>Publish</ButtonPublishArchive>
                            }
                        </PTable>,

                        <PTable key={index + '-8'}>
                            <IconOptions onClick={() => { displayMenuOptions(index) }} />
                            <DivCtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} isInTable={true} >
                                <ButtonOption onClick={() => { navigateToContactUpdate(contactData._id) }}>Update</ButtonOption>
                                <ButtonOption onClick={() => { deleteContactById(contactData._id, index) }}>Delete</ButtonOption>
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

        </contactStyles.SectionPageContact >
    )
}