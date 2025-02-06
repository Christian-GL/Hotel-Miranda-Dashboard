
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ApiStatus } from '../../common/enums/ApiStatus.ts'
import { ContactStateInterface } from '../interfaces/contactStateInterface.ts'
import { ContactInterface } from '../interfaces/contactInterface.ts'
import { RootState } from '../../common/redux/store.ts'
import { ContactFetchAllThunk } from './thunks/contactFetchAllThunk'
import { ContactFetchByIDThunk } from './thunks/contactFetchByIDThunk'
import { ContactCreateThunk } from './thunks/contactCreateThunk'
import { ContactUpdateThunk } from './thunks/contactUpdateThunk'
import { ContactDeleteByIdThunk } from './thunks/contactDeleteByIdThunk'


export const ContactSlice = createSlice({
    name: 'contact',
    initialState: {
        allData: [] as ContactInterface[],
        notArchived: [] as ContactInterface[],
        archived: [] as ContactInterface[],
        idData: {} as ContactInterface,
        allStatus: ApiStatus.idle,
        idStatus: ApiStatus.idle,
        createStatus: ApiStatus.idle,
        updateStatus: ApiStatus.idle,
        deleteStatus: ApiStatus.idle,
        error: false
    } as ContactStateInterface,
    reducers: {
        archiveContact: (state, action: PayloadAction<number>) => {
            const contactId = action.payload
            const contactInNotArchived = state.notArchived.find(contact => contact.id === contactId)
            if (contactInNotArchived) {
                state.notArchived = state.notArchived.filter(contact => contact.id !== contactId)
                state.archived.push(contactInNotArchived)
            }
        },
        restoreContact: (state, action: PayloadAction<number>) => {
            const contactId = action.payload
            const contactInArchived = state.archived.find(contact => contact.id === contactId)
            if (contactInArchived) {
                state.archived = state.archived.filter(contact => contact.id !== contactId)
                state.notArchived.push(contactInArchived)
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(ContactFetchAllThunk.pending, (state) => {
                state.allStatus = ApiStatus.pending
            })
            .addCase(ContactFetchAllThunk.fulfilled, (state, action: PayloadAction<ContactInterface[]>) => {
                state.allStatus = ApiStatus.fulfilled
                state.allData = action.payload
                state.notArchived = [...action.payload]
                state.archived = []
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
                state.notArchived.push(action.payload)
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
                const index = state.allData.findIndex(contact => contact.id === contactToUpdate.id)
                if (index !== -1) {
                    state.allData[index] = contactToUpdate
                }
                if (state.idData && state.idData.id === contactToUpdate.id) {
                    state.idData = contactToUpdate
                }

                const notArchivedIndex = state.notArchived.findIndex(contact => contact.id === contactToUpdate.id)
                if (notArchivedIndex !== -1) {
                    state.notArchived[notArchivedIndex] = contactToUpdate
                }
                const archivedIndex = state.archived.findIndex(contact => contact.id === contactToUpdate.id)
                if (archivedIndex !== -1) {
                    state.archived[archivedIndex] = contactToUpdate
                }
            })
            .addCase(ContactUpdateThunk.rejected, (state) => {
                state.error = true
                state.updateStatus = ApiStatus.rejected
            })

            .addCase(ContactDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = ApiStatus.pending
            })
            .addCase(ContactDeleteByIdThunk.fulfilled, (state, action: PayloadAction<number>) => {
                state.deleteStatus = ApiStatus.fulfilled
                const contactIdToDelete = action.payload
                state.allData = state.allData.filter(contact => contact.id !== contactIdToDelete)
                state.notArchived = state.notArchived.filter(contact => contact.id !== contactIdToDelete)
                state.archived = state.archived.filter(contact => contact.id !== contactIdToDelete)
            })
            .addCase(ContactDeleteByIdThunk.rejected, (state) => {
                state.error = true
                state.deleteStatus = ApiStatus.rejected
            })
    }
})


export const { archiveContact, restoreContact } = ContactSlice.actions

export const getContactAllData = (state: RootState): ContactInterface[] => state.contactSlice.allData
export const getContactNotArchived = (state: RootState): ContactInterface[] => state.contactSlice.notArchived
export const getContactArchived = (state: RootState): ContactInterface[] => state.contactSlice.archived
export const getContactIdData = (state: RootState): ContactInterface => state.contactSlice.idData

export const getContactAllStatus = (state: RootState) => state.contactSlice.allStatus
export const getContactIdStatus = (state: RootState) => state.contactSlice.idStatus
export const getContactCreateStatus = (state: RootState) => state.contactSlice.createStatus
export const getContactUpdateStatus = (state: RootState) => state.contactSlice.updateStatus
export const getContactDeleteStatus = (state: RootState) => state.contactSlice.deleteStatus

export const getContactError = (state: RootState) => state.contactSlice.error