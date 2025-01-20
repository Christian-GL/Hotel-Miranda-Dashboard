
import { useState } from "react";
import { createAsyncThunk } from "@reduxjs/toolkit";

import contactsData from '../../../common/data/contactData.json'


export const ContactThunk = createAsyncThunk("contactThunk", async () => {

    const [listContacts, setListContacts] = useState(contactsData)

    try {
        let myListContacts = []
        listContacts.map((contact) => {
            myListContacts.push(contact)
        })

        return myListContacts
    }
    catch (error) {
        console.log(error)
    }

})