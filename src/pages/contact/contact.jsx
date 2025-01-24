
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as contactJS from "./contact.js"
import * as gb from '../../common/styles/globalVars.js'
import { ArticleReview } from "../../common/components/articleReview/articleReview.jsx"
import { TableDisplayIndicator } from "../../common/components/table/tableDisplaySelector/tableDisplaySelector.jsx"
import { TableSearchTerm } from "../../common/components/table/tableSearchTerm/tableSearchTerm.jsx"
import { ButtonCreate } from "../../common/components/buttonCreate/buttonCreate.jsx"
import { Table, THTable, PTable, IconPhone, ButtonPublishArchive, IconOptions, DivCtnOptions, ButtonOption } from "../../common/components/table/createTable/createTable.js"
import { getContactAllData, getContactAllStatus, getContactError } from "./features/contactSlice.js"
import { ContactFetchAllThunk } from "./features/thunks/contactFetchAllThunk.js"
import { ContactDeleteByIdThunk } from "./features/thunks/contactDeleteByIdThunk.js"


export const Contact = () => {

    const navigate = useNavigate()
    const navigateToContactCreate = () => {
        navigate('contact-create')
    }
    const navigateToContactUpdate = (id) => {
        navigate(`contact-update/${id}`)
    }

    const nameColumnList = ['Order ID', 'Date', 'Customer', 'Comment', 'Action', '']
    const [contactDisplayed, setContactDisplayed] = useState([])
    const contactAll = useSelector(getContactAllData)
    const contactAllLoading = useSelector(getContactAllStatus)
    const [inputText, setInputText] = useState('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState();

    const dispatch = useDispatch()
    useEffect(() => {
        if (contactAllLoading === "idle") { dispatch(ContactFetchAllThunk()) }
        else if (contactAllLoading === "fulfilled") {
            if (inputText === '') {
                setContactDisplayed(contactAll)
            }
            else {
                const contactById = contactAll.filter(contact =>
                    contact.id === parseInt(inputText)
                )
                setContactDisplayed(contactById)
            }
        }
        else if (contactAllLoading === "rejected") { alert("Error en la api") }
    }, [contactAllLoading, contactAll, inputText])

    const handleInputTerm = (e) => {
        setInputText(e.target.value)
    }
    const deleteContactById = (id, index) => {
        dispatch(ContactDeleteByIdThunk(parseInt(id)))
        displayMenuOptions(index)
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
                    <ArticleReview
                        nameprofile="Pedro Sánchez"
                        timesince="4m"
                        textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                    />
                    <ArticleReview
                        nameprofile="Perro Sánchez"
                        timesince="5m"
                        textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                    />
                    <ArticleReview
                        nameprofile="Pablo Sales"
                        timesince="7m"
                        textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                    />
                </contactJS.DivCtnReviews>
            </contactJS.SectionReviews>

            <contactJS.DivCtnFuncionality>
                <contactJS.DivCtnTableDisplayFilter>
                    <TableDisplayIndicator text='All Contacts' />
                    <TableDisplayIndicator text='Archived' />
                </contactJS.DivCtnTableDisplayFilter>

                <contactJS.DivCtnSearch>
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search contact by ID' />
                </contactJS.DivCtnSearch>

                <contactJS.DivCtnButton>
                    <ButtonCreate onclick={navigateToContactCreate} text='+ New Contact' />
                </contactJS.DivCtnButton>
            </contactJS.DivCtnFuncionality>

            <Table rowlistlength={`${contactDisplayed.length + 1}`} columnlistlength={`${nameColumnList.length}`} >
                {/* <thead>
                    <tr> */}
                {nameColumnList.map((nameColumn, index) =>
                    <THTable key={index}>{nameColumn}</THTable>
                )}
                {/* </tr>
                </thead>
                <tbody> */}
                {contactDisplayed.map((contactData, index) => {
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
                            <ButtonPublishArchive color={`${gb.colorGreen}`}>Publish</ButtonPublishArchive>
                            <ButtonPublishArchive color={`${gb.colorRed}`}>Archive</ButtonPublishArchive>
                        </PTable>,

                        <PTable key={index + '-8'}>
                            <IconOptions onClick={() => { displayMenuOptions(index) }} />
                            <DivCtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} >
                                <ButtonOption onClick={() => { navigateToContactUpdate(contactData.id) }}>Update</ButtonOption>
                                <ButtonOption onClick={() => { deleteContactById(contactData.id, index) }}>Delete</ButtonOption>
                            </DivCtnOptions>
                        </PTable>
                    ]
                }
                )}
                {/* </tbody> */}
            </Table>

        </contactJS.SectionPageContact >

    )
}