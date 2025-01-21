
import { createSlice } from '@reduxjs/toolkit';
import { ContactFetchAllThunk } from './thunks/contactFetchAllThunk';
import { ContactFetchByIDThunk } from './thunks/contactFetchByIDThunk';
import { ContactCreateThunk } from './thunks/contactCreateThunk';

export const ContactSlice = createSlice({
    name: 'contactSlice',
    initialState: {
        allData: [],
        idData: null,
        allStatus: 'idle',
        idStatus: 'idle',
        createStatus: 'idle',
        allError: false,
        idError: false,
        createError: false
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

            .addCase(ContactCreateThunk.pending, (state) => {
                state.contactCreateStatus = 'loading';
            })
            .addCase(ContactCreateThunk.fulfilled, (state, action) => {
                state.contactCreateStatus = 'succeeded';
                state.allData.push(action.payload);
            })
            .addCase(ContactCreateThunk.rejected, (state, action) => {
                state.contactCreateStatus = 'failed';
                state.contactCreateError = action.payload;
            })
    }
})

export const getContactAllData = (state) => state.contactSlice.allData
export const getContactAllStatus = (state) => state.contactSlice.allStatus
export const getContactAllError = (state) => state.contactSlice.allError

export const getContactIdData = (state) => state.contactSlice.idData
export const getContactIdStatus = (state) => state.contactSlice.idStatus
export const getContactIdError = (state) => state.contactSlice.idError

export const getContactCreateStatus = (state) => state.contactSlice.createStatus
export const getContactCreateError = (state) => state.contactSlice.createError