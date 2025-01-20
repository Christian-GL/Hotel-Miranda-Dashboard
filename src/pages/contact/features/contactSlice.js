
import { createSlice } from '@reduxjs/toolkit';
import { ContactThunk } from './contactThunk';

export const ContactSlice = createSlice({
    name: 'contactSlice',
    initialState: {
        data: [],
        status: 'idle',
        error: false
    },
    reducers: {
        // 'resetSearchPhotoStatus': (state) => {
        //     state.randomStatus = 'idle'
        // }
    },
    extraReducers: (builder) => {
        builder
            .addCase(ContactThunk.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(ContactThunk.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.data = action.payload
            })
            .addCase(ContactThunk.rejected, (state) => {
                state.error = true
                state.status = 'rejected'
            })
    }
})

export const getContactData = (state) => state.contactSlice.data
export const getContactStatus = (state) => state.contactSlice.status
export const getContactError = (state) => state.contactSlice.error

// export const { resetSearchPhotoStatus } = ApiPhotoListSlice.actions