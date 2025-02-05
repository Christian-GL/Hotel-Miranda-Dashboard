
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Swiper, SwiperSlide } from 'swiper/react'

import * as contactJS from "./contact.js"
import * as gb from '../common/styles/globalVars.js'
import { dateFormatToYYYYMMDD, hourFormatTo24H } from "../common/utils/formUtils.js"
import { ArticleReview } from "../common/components/articleReview/articleReview.jsx"
import { TableDisplayIndicator } from "../common/components/tableDisplaySelector/tableDisplaySelector.tsx"
import { TableSearchTerm } from "../common/components/tableSearchTerm/tableSearchTerm.tsx"
import { ButtonCreate } from "../common/components/buttonCreate/buttonCreate.tsx"
import { Table, THTable, TriangleUp, TriangleRight, TriangleDown, PTable, IconPhone, ButtonPublishArchive, IconOptions, DivCtnOptions, ButtonOption } from "../common/styles/table.styles.tsx"
import { usePagination } from "../common/hooks/usePagination.js"
import * as paginationJS from '../common/styles/pagination.tsx'
import { getContactAllData, getContactAllStatus, getContactNotArchived, getContactArchived } from "./features/contactSlice.js"
import { archiveContact, restoreContact } from "./features/contactSlice.js"
import { ContactFetchAllThunk } from "./features/thunks/contactFetchAllThunk.js"
import { ContactDeleteByIdThunk } from "./features/thunks/contactDeleteByIdThunk.js"


export const Contact = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const nameColumnList = ['Order ID', 'Date', 'Customer', 'Comment', 'Action', '']
    const contactAll = useSelector(getContactAllData)
    const contactAllLoading = useSelector(getContactAllStatus)
    const notArchived = useSelector(getContactNotArchived)
    const archived = useSelector(getContactArchived)
    const [inputText, setInputText] = useState('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState()
    const [filteredContacts, setFilteredContacts] = useState([])
    const [selectedButton, setSelectedButton] = useState('notarchived')
    const [arrowStates, setArrowStates] = useState({
        orderId: 'right',
        date: 'down',
        customer: 'right'
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

    useEffect(() => {
        if (contactAllLoading === "idle") { dispatch(ContactFetchAllThunk()) }
        else if (contactAllLoading === "fulfilled") {
            selectedButton === 'notarchived' ?
                displayNotArchivedContacts() :
                displayArchivedContacts()
        }
        else if (contactAllLoading === "rejected") { alert("Error en la api") }
    }, [contactAllLoading, contactAll, inputText, selectedButton, arrowStates])
    useEffect(() => {
        selectedButton === 'notarchived' ?
            displayNotArchivedContacts() :
            displayArchivedContacts()
    }, [notArchived])
    useEffect(() => {
        selectedButton === 'notarchived' ?
            displayNotArchivedContacts() :
            displayArchivedContacts()
    }, [archived])

    const navigateToContactCreate = () => {
        navigate('contact-create')
    }
    const navigateToContactUpdate = (id) => {
        navigate(`contact-update/${id}`)
    }

    const handleInputTerm = (e) => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (type) => {
        setSelectedButton(type)
        type === 'notarchived' ?
            displayNotArchivedContacts() :
            displayArchivedContacts()
    }
    const displayNotArchivedContacts = () => {
        const filteredData = notArchived.filter(contact =>
            contact.full_name.toLowerCase().includes(inputText.toLowerCase())
        )
        const sortedData = sortData(filteredData)
        setFilteredContacts(sortedData)
    }
    const displayArchivedContacts = () => {
        const filteredData = archived.filter(contact =>
            contact.full_name.toLowerCase().includes(inputText.toLowerCase())
        )
        const sortedData = sortData(filteredData)
        setFilteredContacts(sortedData)
    }
    const sortData = (filteredData) => {
        const activeColumn = Object.keys(arrowStates).find(key => arrowStates[key] !== 'right')
        let sortedData
        if (activeColumn) {
            sortedData = filteredData.sort((a, b) => {
                let valueA
                let valueB

                if (activeColumn === 'orderId') {
                    valueA = a.id
                    valueB = b.id
                }
                else if (activeColumn === 'date') {
                    valueA = new Date(dateFormatToYYYYMMDD(a.publish_date) + ' ' + hourFormatTo24H(a.publish_time))
                    valueB = new Date(dateFormatToYYYYMMDD(b.publish_date) + ' ' + hourFormatTo24H(b.publish_time))
                }
                else if (activeColumn === 'customer') {
                    valueA = a.full_name.toLowerCase()
                    valueB = b.full_name.toLowerCase()
                }

                if (arrowStates[activeColumn] === 'down') {
                    return valueB > valueA ? -1 : 1
                } else {
                    return valueA > valueB ? -1 : 1
                }
            })
        }
        return sortedData
    }
    const handleColumnClick = (column) => {
        setArrowStates(prevState => {
            const newState = { ...prevState }

            if (newState[column] === 'right') { newState[column] = 'down' }
            else if (newState[column] === 'down') { newState[column] = 'up' }
            else if (newState[column] === 'up') { newState[column] = 'down' }

            Object.keys(newState).forEach(key => {
                if (key !== column) {
                    newState[key] = 'right'
                }
            })

            return newState
        })

        handleTableFilter(selectedButton)
    }
    const getArrowIcon = (column) => {
        const state = arrowStates[column]
        if (state === 'up') { return <TriangleUp /> }
        else if (state === 'down') { return <TriangleDown /> }
        else { return <TriangleRight /> }
    }
    const publish = (id) => {
        if (archived.some(contact => contact.id === id)) {
            dispatch(restoreContact(id))
        }
    }
    const archive = (id) => {
        if (notArchived.some(contact => contact.id === id)) {
            dispatch(archiveContact(id))
        }
    }
    const displayMenuOptions = (index) => {
        tableOptionsDisplayed === index ?
            setTableOptionsDisplayed() :
            setTableOptionsDisplayed(index)
    }
    const deleteContactById = (id, index) => {
        dispatch(ContactDeleteByIdThunk(parseInt(id)))
        displayMenuOptions(index)
        resetPage()
    }


    return (

        <contactJS.SectionPageContact>

            <contactJS.SectionReviews>
                <contactJS.DivCtnReviews>
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={3}
                        navigation={false}
                        pagination={{ clickable: true }}
                        loop={true}
                    >
                        {contactAll.map((contact, index) => {
                            return <SwiperSlide key={index}>
                                <ArticleReview
                                    nameprofile={contact.full_name}
                                    timesince={`${contact.publish_date} - ${contact.publish_time}`}
                                    textreview={contact.comment}
                                />
                            </SwiperSlide>
                        })}
                    </Swiper>
                </contactJS.DivCtnReviews>
            </contactJS.SectionReviews>

            <contactJS.DivCtnFuncionality>
                <contactJS.DivCtnTableDisplayFilter>
                    <TableDisplayIndicator text='Contacts' onClick={() => handleTableFilter('notarchived')} isSelected={selectedButton === 'notarchived'} />
                    <TableDisplayIndicator text='Archived' onClick={() => handleTableFilter('archived')} isSelected={selectedButton === 'archived'} />
                </contactJS.DivCtnTableDisplayFilter>

                <contactJS.DivCtnSearch>
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search by contact name' />
                </contactJS.DivCtnSearch>

                <contactJS.DivCtnButton>
                    <ButtonCreate onClick={navigateToContactCreate} children='+ New Contact' />
                </contactJS.DivCtnButton>
            </contactJS.DivCtnFuncionality>

            <Table rowlistlength={`${filteredContacts.length + 1}`} columnlistlength={`${nameColumnList.length}`} >
                {nameColumnList.map((nameColumn, index) =>
                    index <= 2 ?
                        <THTable key={index} cursorPointer='yes' onClick={() => {
                            switch (index) {
                                case 0: handleColumnClick('orderId'); break
                                case 1: handleColumnClick('date'); break
                                case 2: handleColumnClick('customer'); break
                                default: ; break
                            }
                        }}
                        >
                            {nameColumn}
                            {(() => {
                                switch (index) {
                                    case 0: return getArrowIcon('orderId')
                                    case 1: return getArrowIcon('date')
                                    case 2: return getArrowIcon('customer')
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

        </contactJS.SectionPageContact >

    )
}