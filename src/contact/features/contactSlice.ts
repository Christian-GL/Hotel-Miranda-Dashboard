
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ApiStatus } from '../../common/enums/ApiStatus'
import { ContactStateInterface } from '../interfaces/contactStateInterface'
import { ContactInterface } from '../interfaces/contactInterface'
import { RootState } from '../../common/redux/store'
import { ContactFetchAllThunk } from './thunks/contactFetchAllThunk'
import { ContactFetchByIDThunk } from './thunks/contactFetchByIDThunk'
import { ContactCreateThunk } from './thunks/contactCreateThunk'
import { ContactUpdateThunk } from './thunks/contactUpdateThunk'
import { ContactDeleteByIdThunk } from './thunks/contactDeleteByIdThunk'


export const ContactSlice = createSlice({
    name: 'contact',
    initialState: {
        allData: [] as ContactInterface[],
        idData: {} as ContactInterface,
        allStatus: ApiStatus.idle,
        idStatus: ApiStatus.idle,
        createStatus: ApiStatus.idle,
        updateStatus: ApiStatus.idle,
        deleteStatus: ApiStatus.idle,
        error: false
    } as ContactStateInterface,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(ContactFetchAllThunk.pending, (state) => {
                state.allStatus = ApiStatus.pending
            })
            .addCase(ContactFetchAllThunk.fulfilled, (state, action: PayloadAction<ContactInterface[]>) => {
                state.allStatus = ApiStatus.fulfilled
                state.allData = action.payload
            })
            .addCase(ContactFetchAllThunk.rejected, (state) => {
                state.error = true
                state.allStatus = ApiStatus.rejected
            })

            .addCase(ContactFetchByIDThunk.pending, (state) => {
                state.idStatus = ApiStatus.pending
            })
            .addCase(ContactFetchByIDThunk.fulfilled, (state, action: PayloadAction<ContactInterface>) => {
                state.idStatus = ApiStatus.fulfilled
                state.idData = action.payload
            })
            .addCase(ContactFetchByIDThunk.rejected, (state) => {
                state.error = true
                state.idStatus = ApiStatus.rejected
            })

            .addCase(ContactCreateThunk.pending, (state) => {
                state.createStatus = ApiStatus.pending
            })
            .addCase(ContactCreateThunk.fulfilled, (state, action: PayloadAction<ContactInterface>) => {
                state.createStatus = ApiStatus.fulfilled
                state.allData.push(action.payload)
            })
            .addCase(ContactCreateThunk.rejected, (state) => {
                state.error = true
                state.createStatus = ApiStatus.rejected
            })

            .addCase(ContactUpdateThunk.pending, (state) => {
                state.updateStatus = ApiStatus.pending
            })
            .addCase(ContactUpdateThunk.fulfilled, (state, action: PayloadAction<ContactInterface>) => {
                state.updateStatus = ApiStatus.fulfilled
                const contactToUpdate = action.payload
                const index = state.allData.findIndex(contact => contact._id === contactToUpdate._id)
                if (index !== -1) {
                    state.allData[index] = contactToUpdate
                }
                if (state.idData && state.idData._id === contactToUpdate._id) {
                    state.idData = contactToUpdate
                }
            })
            .addCase(ContactUpdateThunk.rejected, (state) => {
                state.error = true
                state.updateStatus = ApiStatus.rejected
            })

            .addCase(ContactDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = ApiStatus.pending
            })
            .addCase(ContactDeleteByIdThunk.fulfilled, (state, action: PayloadAction<string>) => {
                state.deleteStatus = ApiStatus.fulfilled
                const contactIdToDelete = action.payload
                state.allData = state.allData.filter(contact => contact._id !== contactIdToDelete)
            })
            .addCase(ContactDeleteByIdThunk.rejected, (state) => {
                state.error = true
                state.deleteStatus = ApiStatus.rejected
            })
    }
})


// export const { archiveContact, restoreContact } = ContactSlice.actions

export const getContactAllData = (state: RootState): ContactInterface[] => state.contactSlice.allData
export const getContactIdData = (state: RootState): ContactInterface => state.contactSlice.idData

export const getContactAllStatus = (state: RootState) => state.contactSlice.allStatus
export const getContactIdStatus = (state: RootState) => state.contactSlice.idStatus
export const getContactCreateStatus = (state: RootState) => state.contactSlice.createStatus
export const getContactUpdateStatus = (state: RootState) => state.contactSlice.updateStatus
export const getContactDeleteStatus = (state: RootState) => state.contactSlice.deleteStatus

export const getContactError = (state: RootState) => state.contactSlice.error