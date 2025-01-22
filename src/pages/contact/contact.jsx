
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as contactJS from "./contact.js"
import { ArticleReview } from "../../common/components/articleReview/articleReview.jsx"
import { TableDisplayIndicator } from "../../common/components/table/tableDisplaySelector/tableDisplaySelector.jsx"
import { TableSearchTerm } from "../../common/components/table/tableSearchTerm/tableSearchTerm.jsx"
import { ButtonCreate } from "../../common/components/buttonCreate/buttonCreate.jsx"
import { Table } from "../../common/components/table/createTable/createTable.jsx"
import { ContactFetchAllThunk } from "./features/thunks/contactFetchAllThunk.js"
import { ContactFetchByIDThunk } from "./features/thunks/contactFetchByIDThunk.js"
import {
    getContactAllData, getContactAllStatus, getContactAllError,
    getContactIdData, getContactIdStatus, getContactIdError
} from "./features/contactSlice.js"


export const Contact = () => {

    const navigate = useNavigate()
    const navigateToContactCreate = () => {
        navigate('./contact-create')
    }

    const nameColumnList = ['Order Id', 'Date', 'Customer', 'Comment', 'Action', '']
    const [contactDisplayed, setContactDisplayed] = useState([])
    const contactAll = useSelector(getContactAllData) || []
    const contactById = useSelector(getContactIdData) || []
    const contactAllLoading = useSelector(getContactAllStatus)

    const dispatch = useDispatch()
    useEffect(() => {
        if (contactAllLoading === "idle") { dispatch(ContactFetchAllThunk()) }
        else if (contactAllLoading === "fulfilled") {
            console.log('-->',contactById.length)
            contactById.length === 0 ?
                setContactDisplayed(contactAll) :
                setContactDisplayed(contactById)
        }
        else if (contactAllLoading === "rejected") { alert("Error en la api") }
    }, [contactAllLoading, contactAll, contactById])

    const handleInputTerm = (e) => {
        const inputText = parseInt(e.target.value)
        if (inputText === '') {    
            dispatch(ContactFetchAllThunk())
        }
        else {
            dispatch(ContactFetchByIDThunk(inputText))
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

            <Table tableType='contact' rowList={contactDisplayed} columnList={nameColumnList}></Table>

        </contactJS.SectionPageContact >

    )
}