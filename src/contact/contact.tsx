
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Swiper, SwiperSlide } from 'swiper/react'

import * as contactStyles from "./contactStyles.ts"
import * as gb from '../common/styles/globalVars.ts'
import { ToastContainer, toast } from 'react-toastify'
import { Toastify } from "../common/components/toastify/toastify.tsx"
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
    Table, THTable, TriangleUp, TriangleRight, TriangleDown, PTable,
    IconPhone, ButtonPublishArchive, IconOptions, DivCtnOptions, ButtonOption
} from "../common/styles/tableStyles.ts"
import { usePagination } from "../common/hooks/usePagination.ts"
import * as paginationJS from '../common/styles/pagination.ts'
import { getContactAllData, getContactAllStatus, getContactNotArchived, getContactArchived } from "./features/contactSlice.ts"
import { archiveContact, restoreContact } from "./features/contactSlice.ts"
import { ContactFetchAllThunk } from "./features/thunks/contactFetchAllThunk.ts"
import { ContactDeleteByIdThunk } from "./features/thunks/contactDeleteByIdThunk.ts"


export const Contact = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    enum ButtonType {
        archived = "archived",
        notArchived = "notarchived"
    }
    enum columnsSortAvailable {
        orderId = 'orderId',
        date = 'date',
        customer = 'customer'
    }
    const nameColumnList = ['Order ID', 'Date', 'Customer', 'Comment', 'Action', '']
    const contactAll = useSelector(getContactAllData)
    const contactAllLoading = useSelector(getContactAllStatus)
    const notArchived = useSelector(getContactNotArchived)
    const archived = useSelector(getContactArchived)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [filteredContacts, setFilteredContacts] = useState<ContactInterface[]>([])
    const [selectedButton, setSelectedButton] = useState<ButtonType>(ButtonType.notArchived)
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
    } = usePagination(filteredContacts, 10)
    const [toastShown, setToastShown] = useState<boolean>(false)

    useEffect(() => {
        if (contactAllLoading === ApiStatus.idle) { dispatch(ContactFetchAllThunk()) }
        else if (contactAllLoading === ApiStatus.fulfilled) {
            selectedButton === ButtonType.notArchived ?
                displayNotArchivedContacts() :
                displayArchivedContacts()
        }
        else if (contactAllLoading === ApiStatus.rejected) { alert("Error en la api de contacts") }
    }, [contactAllLoading, contactAll, inputText, selectedButton, arrowStates])
    useEffect(() => {
        selectedButton === ButtonType.notArchived ?
            displayNotArchivedContacts() :
            displayArchivedContacts()
    }, [notArchived])
    useEffect(() => {
        selectedButton === ButtonType.notArchived ?
            displayNotArchivedContacts() :
            displayArchivedContacts()
    }, [archived])
    useEffect(() => {
        if (contactAllLoading === ApiStatus.pending) {
            if (!toastShown) {
                Toastify()
                setToastShown(true)
            }
        } else { toast.dismiss() }
    }, [contactAllLoading])

    const navigateToContactCreate = (): void => {
        navigate('contact-create')
    }
    const navigateToContactUpdate = (id: number): void => {
        navigate(`contact-update/${id}`)
    }

    const handleInputTerm = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (type: ButtonType): void => {
        setSelectedButton(type)
        type === ButtonType.notArchived ?
            displayNotArchivedContacts() :
            displayArchivedContacts()
    }
    const displayNotArchivedContacts = (): void => {
        const filteredData = notArchived.filter(contact =>
            contact.full_name.toLowerCase().includes(inputText.toLowerCase())
        )
        const sortedData = sortData(filteredData)
        setFilteredContacts(sortedData)
    }
    const displayArchivedContacts = (): void => {
        const filteredData = archived.filter(contact =>
            contact.full_name.toLowerCase().includes(inputText.toLowerCase())
        )
        const sortedData = sortData(filteredData)
        setFilteredContacts(sortedData)
    }
    const sortData = (filteredData: ContactInterface[]): ContactInterface[] => {
        const activeColumn = Object.keys(arrowStates).find(key => arrowStates[key] !== ArrowType.right)
        let sortedData: ContactInterface[] = [...filteredData]
        if (activeColumn) {
            sortedData.sort((a, b) => {
                let valueA: number | string | Date
                let valueB: number | string | Date

                if (activeColumn === columnsSortAvailable.orderId) {
                    valueA = a.id
                    valueB = b.id
                }
                else if (activeColumn === columnsSortAvailable.date) {
                    valueA = new Date(dateFormatToYYYYMMDD(a.publish_date) + ' ' + hourFormatTo24H(a.publish_time))
                    valueB = new Date(dateFormatToYYYYMMDD(b.publish_date) + ' ' + hourFormatTo24H(b.publish_time))
                }
                else if (activeColumn === columnsSortAvailable.customer) {
                    valueA = a.full_name.toLowerCase()
                    valueB = b.full_name.toLowerCase()
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
            const newState = { ...prevState }

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
    const publish = (id: number) => {
        if (archived.some(contact => contact.id === id)) {
            dispatch(restoreContact(id))
        }
    }
    const archive = (id: number) => {
        if (notArchived.some(contact => contact.id === id)) {
            dispatch(archiveContact(id))
        }
    }
    const displayMenuOptions = (index: number): void => {
        tableOptionsDisplayed === index ?
            setTableOptionsDisplayed(-1) :
            setTableOptionsDisplayed(index)
    }
    const deleteContactById = (id: number, index: number): void => {
        dispatch(ContactDeleteByIdThunk(id))
        displayMenuOptions(index)
        resetPage()
    }


    return (
        contactAllLoading === ApiStatus.pending ?
            <ToastContainer /> :
            <contactStyles.SectionPageContact>

                <contactStyles.SectionReviews>
                    <contactStyles.DivCtnReviews>
                        <Swiper
                            spaceBetween={0}
                            slidesPerView={3}
                            navigation={false}
                            pagination={{ clickable: true }}
                            loop={true}
                        >
                            {filteredContacts.map((contact: ContactInterface, index: number) => {
                                return <SwiperSlide key={index}>
                                    <ArticleReview
                                        nameProfile={contact.full_name}
                                        timeSince={`${contact.publish_date} - ${contact.publish_time}`}
                                        textReview={contact.comment}
                                    />
                                </SwiperSlide>
                            })}
                        </Swiper>
                    </contactStyles.DivCtnReviews>
                </contactStyles.SectionReviews>

                <contactStyles.DivCtnFuncionality>
                    <contactStyles.DivCtnTableDisplayFilter>
                        <TableDisplayIndicator text='Contacts' onClick={() => handleTableFilter(ButtonType.notArchived)} isSelected={selectedButton === ButtonType.notArchived} />
                        <TableDisplayIndicator text='Archived' onClick={() => handleTableFilter(ButtonType.archived)} isSelected={selectedButton === ButtonType.archived} />
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
                                #<b>{contactData.id}</b>
                            </PTable>,

                            <PTable key={index + '-2'} >
                                {contactData.publish_date} {contactData.publish_time}
                            </PTable>,

                            <PTable key={index + '-3'} flexdirection='column' alignitems='left' justifycontent='center'>
                                <div style={{ color: `${gb.colorGreen}` }}>
                                    <b>{contactData.full_name}</b>
                                </div>
                                <div>{contactData.email}</div>
                                <div style={{ display: 'flex', alignItems: 'bottom' }}>
                                    <IconPhone width='1.3rem' />
                                    <div>{contactData.contact}</div>
                                </div>
                            </PTable>,

                            <PTable key={index + '-4'} >
                                {contactData.comment}
                            </PTable>,

                            <PTable key={index + '-5'}>
                                {
                                    selectedButton === 'notarchived' ?
                                        <ButtonPublishArchive onClick={() => archive(contactData.id)} color={gb.colorRed}>Archive</ButtonPublishArchive> :
                                        <ButtonPublishArchive onClick={() => publish(contactData.id)} color={gb.colorGreen}>Publish</ButtonPublishArchive>
                                }
                            </PTable>,

                            <PTable key={index + '-8'}>
                                <IconOptions onClick={() => { displayMenuOptions(index) }} />
                                <DivCtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} >
                                    <ButtonOption onClick={() => { navigateToContactUpdate(contactData.id) }}>Update</ButtonOption>
                                    <ButtonOption onClick={() => { deleteContactById(contactData.id, index) }}>Delete</ButtonOption>
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