
import { createSlice } from '@reduxjs/toolkit';
import { ContactFetchAllThunk } from './thunks/contactFetchAllThunk';
import { ContactFetchByIDThunk } from './thunks/contactFetchByIDThunk';
import { ContactCreateThunk } from './thunks/contactCreateThunk';
import { ContactUpdateByIdThunk } from './thunks/contactUpdateByIdThunk';
import { ContactDeleteByIdThunk } from './thunks/contactDeleteByIdThunk'

export const ContactSlice = createSlice({
    name: 'contact',
    initialState: {
        allData: [],
        idData: null,
        allStatus: 'idle',
        idStatus: 'idle',
        allError: false,
        idError: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(ContactFetchAllThunk.pending, (state) => {
                state.allStatus = 'pending'
            })
            .addCase(ContactFetchAllThunk.fulfilled, (state, action) => {
                state.allStatus = 'fulfilled'
                state.allData = action.payload
            })
            .addCase(ContactFetchAllThunk.rejected, (state) => {
                state.allError = true
                state.allStatus = 'rejected'
            })

            .addCase(ContactFetchByIDThunk.pending, (state) => {
                state.idStatus = 'pending'
            })
            .addCase(ContactFetchByIDThunk.fulfilled, (state, action) => {
                state.idStatus = 'fulfilled'
                state.idData = action.payload
            })
            .addCase(ContactFetchByIDThunk.rejected, (state) => {
                state.idError = true
                state.idStatus = 'rejected'
            })

            .addCase(ContactCreateThunk.fulfilled, (state, action) => {
                state.allData.push(action.payload);
            })

            .addCase(ContactUpdateByIdThunk.fulfilled, (state, action) => {
                const contactToUpdate = action.payload;
                const index = state.allData.findIndex(contact => contact.id === contactToUpdate.id);
                if (index !== -1) {
                    state.allData[index] = contactToUpdate;
                }
                if (state.idData && state.idData.id === contactToUpdate.id) {
                    state.idData = contactToUpdate;
                }
            })

            .addCase(ContactDeleteByIdThunk.fulfilled, (state, action) => {
                const contactIdToDelete = action.payload;
                state.allData = state.allData.filter(contact => contact.id !== contactIdToDelete);
                if (state.idData && state.idData.id === contactIdToDelete) {
                    state.idData = null;
                }
            })
    }
})

export const getContactAllData = (state) => state.contactSlice.allData
export const getContactAllStatus = (state) => state.contactSlice.allStatus
export const getContactAllError = (state) => state.contactSlice.allError

export const getContactIdData = (state) => state.contactSlice.idData
export const getContactIdStatus = (state) => state.contactSlice.idStatus
export const getContactIdError = (state) => state.contactSlice.idError