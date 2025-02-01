
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Swiper, SwiperSlide } from 'swiper/react'

import * as contactJS from "./contact.js"
import * as gb from '../common/styles/globalVars.js'
import { ArticleReview } from "../common/components/articleReview/articleReview.jsx"
import { TableDisplayIndicator } from "../common/components/tableDisplaySelector/tableDisplaySelector.jsx"
import { TableSearchTerm } from "../common/components/tableSearchTerm/tableSearchTerm.jsx"
import { ButtonCreate } from "../common/components/buttonCreate/buttonCreate.jsx"
import { Table, THTable, PTable, IconPhone, ButtonPublishArchive, IconOptions, DivCtnOptions, ButtonOption } from "../common/styles/table.js"
import { usePagination } from "../common/hooks/usePagination.js"
import * as paginationJS from '../common/styles/pagination.js'
import { getContactAllStatus, getContactError, getContactNotArchived, getContactArchived } from "./features/contactSlice.js"
import { archiveContact, restoreContact } from "./features/contactSlice.js"
import { ContactFetchAllThunk } from "./features/thunks/contactFetchAllThunk.js"
import { ContactDeleteByIdThunk } from "./features/thunks/contactDeleteByIdThunk.js"


export const Contact = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const nameColumnList = ['Order ID', 'Date', 'Customer', 'Comment', 'Action', '']
    const contactAllLoading = useSelector(getContactAllStatus)
    const notArchived = useSelector(getContactNotArchived)
    const archived = useSelector(getContactArchived)
    const [inputText, setInputText] = useState('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState()
    const [filteredContacts, setFilteredContacts] = useState([])
    const [selectedButton, setSelectedButton] = useState('notarchived')
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
    }, [contactAllLoading, inputText])
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
    const handleTableFilter = (type) => {
        setSelectedButton(type)
        type === 'notarchived' ?
            displayNotArchivedContacts() :
            displayArchivedContacts()
    }
    const displayNotArchivedContacts = () => {
        const filtered = notArchived.filter(contact =>
            contact.full_name.toLowerCase().includes(inputText.toLowerCase())
        )
        setFilteredContacts(filtered)
    }
    const displayArchivedContacts = () => {
        const filtered = archived.filter(contact =>
            contact.full_name.toLowerCase().includes(inputText.toLowerCase())
        )
        setFilteredContacts(filtered)
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
    const handleInputTerm = (e) => {
        setInputText(e.target.value)
        resetPage()
    }
    const deleteContactById = (id, index) => {
        dispatch(ContactDeleteByIdThunk(parseInt(id)))
        displayMenuOptions(index)
        resetPage()
    }
    const displayMenuOptions = (index) => {
        tableOptionsDisplayed === index ?
            setTableOptionsDisplayed() :
            setTableOptionsDisplayed(index)
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
                        <SwiperSlide>
                            <ArticleReview
                                nameprofile="Pedro Sánchez"
                                timesince="4m"
                                textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ArticleReview
                                nameprofile="Perro Sánchez"
                                timesince="5m"
                                textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ArticleReview
                                nameprofile="Pablo Sales"
                                timesince="7m"
                                textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ArticleReview
                                nameprofile="Pedro Sánchez"
                                timesince="4m"
                                textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ArticleReview
                                nameprofile="Perro Sánchez"
                                timesince="5m"
                                textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <ArticleReview
                                nameprofile="Pablo Sales"
                                timesince="7m"
                                textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                            />
                        </SwiperSlide>
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