
import { createSlice } from '@reduxjs/toolkit'
import { ContactFetchAllThunk } from './thunks/contactFetchAllThunk'
import { ContactFetchByIDThunk } from './thunks/contactFetchByIDThunk'
import { ContactCreateThunk } from './thunks/contactCreateThunk'
import { ContactUpdateThunk } from './thunks/contactUpdateThunk'
import { ContactDeleteByIdThunk } from './thunks/contactDeleteByIdThunk'


export const ContactSlice = createSlice({
    name: 'contact',
    initialState: {
        allData: [],
        notArchived: [],
        archived: [],
        idData: {},
        allStatus: 'idle',
        idStatus: 'idle',
        createStatus: 'idle',
        updateStatus: 'idle',
        deleteStatus: 'idle',
        error: false
    },
    reducers: {
        archiveContact: (state, action) => {
            const contactId = action.payload
            const contactInNotArchived = state.notArchived.find(contact => contact.id === contactId)
            if (contactInNotArchived) {
                state.notArchived = state.notArchived.filter(contact => contact.id !== contactId)
                state.archived.push(contactInNotArchived)
            }
        },
        restoreContact: (state, action) => {
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
                state.allStatus = 'pending'
            })
            .addCase(ContactFetchAllThunk.fulfilled, (state, action) => {
                state.allStatus = 'fulfilled'
                state.allData = action.payload
                state.notArchived = [...action.payload]
                state.archived = []
            })
            .addCase(ContactFetchAllThunk.rejected, (state) => {
                state.error = true
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
                state.error = true
                state.idStatus = 'rejected'
            })

            .addCase(ContactCreateThunk.pending, (state) => {
                state.createStatus = 'pending'
            })
            .addCase(ContactCreateThunk.fulfilled, (state, action) => {
                state.createStatus = 'fulfilled'
                state.allData.push(action.payload)
                state.notArchived.push(action.payload)
            })
            .addCase(ContactCreateThunk.rejected, (state) => {
                state.error = true
                state.createStatus = 'rejected'
            })

            .addCase(ContactUpdateThunk.pending, (state) => {
                state.updateStatus = 'pending'
            })
            .addCase(ContactUpdateThunk.fulfilled, (state, action) => {
                state.updateStatus = 'fulfilled'
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
                state.updateStatus = 'rejected'
            })

            .addCase(ContactDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = 'pending'
            })
            .addCase(ContactDeleteByIdThunk.fulfilled, (state, action) => {
                state.deleteStatus = 'fulfilled'
                const contactIdToDelete = action.payload
                state.allData = state.allData.filter(contact => contact.id !== contactIdToDelete)
                state.notArchived = state.notArchived.filter(contact => contact.id !== contactIdToDelete)
                state.archived = state.archived.filter(contact => contact.id !== contactIdToDelete)
                if (state.idData && state.idData.id === contactIdToDelete) {
                    state.idData = null
                }
            })
            .addCase(ContactDeleteByIdThunk.rejected, (state) => {
                state.error = true
                state.deleteStatus = 'rejected'
            })
    }
})


export const { archiveContact, restoreContact } = ContactSlice.actions

export const getContactAllData = (state) => state.contactSlice.allData
export const getContactNotArchived = (state) => state.contactSlice.notArchived
export const getContactArchived = (state) => state.contactSlice.archived
export const getContactIdData = (state) => state.contactSlice.idData

export const getContactAllStatus = (state) => state.contactSlice.allStatus
export const getContactIdStatus = (state) => state.contactSlice.idStatus
export const getContactCreateStatus = (state) => state.contactSlice.createStatus
export const getContactUpdateStatus = (state) => state.contactSlice.updateStatus
export const getContactDeleteStatus = (state) => state.contactSlice.deleteStatus

export const getContactError = (state) => state.contactSlice.allError