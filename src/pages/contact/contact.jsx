
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
import {
    getContactAllData, getContactAllStatus, getContactError,
    getContactIdData, getContactIdStatus
} from "./features/contactSlice.js"
import { ContactFetchAllThunk } from "./features/thunks/contactFetchAllThunk.js"
import { ContactFetchByIDThunk } from "./features/thunks/contactFetchByIDThunk.js"
import { ContactDeleteByIdThunk } from "./features/thunks/contactDeleteByIdThunk.js"



export const Contact = () => {

    const navigate = useNavigate()
    const navigateToContactCreate = () => {
        navigate('./contact-create')
    }
    const navigateToContactUpdate = (id) => {
        navigate(`./contact-update/${id}`)
    }
    const deleteContactById = (id) => {
        dispatch(ContactDeleteByIdThunk(parseInt(id)))
    }

    const nameColumnList = ['Order Id', 'Date', 'Customer', 'Comment', 'Action', '']
    const [contactDisplayed, setContactDisplayed] = useState([])
    const contactAll = useSelector(getContactAllData) || []
    const contactById = useSelector(getContactIdData) || {}
    const contactAllLoading = useSelector(getContactAllStatus)
    const contactIdLoading = useSelector(getContactIdStatus)
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState();

    const dispatch = useDispatch()
    useEffect(() => {
        if (contactAllLoading === "idle") { dispatch(ContactFetchAllThunk()) }
        else if (contactAllLoading === "fulfilled") {
            Object.keys(contactById).length !== 0 ?
                setContactDisplayed([contactById]) :
                setContactDisplayed(contactAll)
        }
        else if (contactAllLoading === "rejected") { alert("Error en la api") }
    }, [contactAllLoading, contactIdLoading, contactAll, contactById])

    const handleInputTerm = (e) => {
        const inputText = parseInt(e.target.value)
        if (inputText === '') {
            dispatch(ContactFetchAllThunk())
        }
        else {
            dispatch(ContactFetchByIDThunk(inputText))
            // if (contactIdLoading === "idle") { dispatch(ContactFetchByIDThunk(inputText)) }
            // else if (contactIdLoading === "fulfilled") { }
            // else if (contactIdLoading === "rejected") { alert("Error en la api") }
        }
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
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search Contact' />
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
                            #{contactData.id}
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
                            <IconOptions onClick={() => {
                                tableOptionsDisplayed === index ?
                                    setTableOptionsDisplayed() :
                                    setTableOptionsDisplayed(index)
                            }} />
                            <DivCtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} >
                                <ButtonOption onClick={() => { navigateToContactUpdate(contactData.id) }}>Update</ButtonOption>
                                <ButtonOption onClick={() => { deleteContactById(contactData.id) }}>Delete</ButtonOption>
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