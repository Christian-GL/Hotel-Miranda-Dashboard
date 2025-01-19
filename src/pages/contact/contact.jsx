
import { useState } from "react"

import * as contactJS from "./contact.js"

import { ArticleReview } from "../../common/components/articleReview/articleReview.jsx"
import { TableDisplayIndicator } from "../../common/components/tableDisplayIndicador/tableDisplayIndicator.jsx"
import { Table } from "../../common/components/table/table.jsx"
import contactData from '../../common/data/contactData.json'


export const Contact = () => {

    const nameColumnList = ['Order Id', 'Date', 'Customer', 'Comment', 'Action']
    const [contacts, setContacts] = useState(contactData)

    return (

        <contactJS.SectionPageBookings>

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

            <contactJS.DivCtnTableDisplayFilter>
                <TableDisplayIndicator text='All Contacts' />
                <TableDisplayIndicator text='Archived' />
            </contactJS.DivCtnTableDisplayFilter>

            <Table tableType='contact' rowList={contacts} columnList={nameColumnList}></Table>

        </contactJS.SectionPageBookings >

    )
}