
import { createSlice } from '@reduxjs/toolkit';
import { BookingFetchAllThunk } from './thunks/bookingFetchAllThunk'
import { BookingFetchByIDThunk } from './thunks/bookingFetchByIDThunk';
import { BookingCreateThunk } from './thunks/bookingCreateThunk';
import { BookingUpdateByIdThunk } from './thunks/bookingUpdateByIdThunk';
import { BookingDeleteByIdThunk } from './thunks/bookingDeleteByIdThunk'


export const BookingSlice = createSlice({
    name: 'booking',
    initialState: {
        allData: [],
        idData: {},
        allStatus: 'idle',
        idStatus: 'idle',
        createStatus: 'idle',
        updateStatus: 'idle',
        deleteStatus: 'idle',
        error: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(BookingFetchAllThunk.pending, (state) => {
                state.allStatus = 'pending'
            })
            .addCase(BookingFetchAllThunk.fulfilled, (state, action) => {
                state.allStatus = 'fulfilled'
                state.allData = action.payload
            })
            .addCase(BookingFetchAllThunk.rejected, (state) => {
                state.error = true
                state.allStatus = 'rejected'
            })

            .addCase(BookingFetchByIDThunk.pending, (state) => {
                state.idStatus = 'pending'
            })
            .addCase(BookingFetchByIDThunk.fulfilled, (state, action) => {
                state.idStatus = 'fulfilled'
                state.idData = action.payload
            })
            .addCase(BookingFetchByIDThunk.rejected, (state) => {
                state.error = true
                state.idStatus = 'rejected'
            })

            .addCase(BookingCreateThunk.pending, (state) => {
                state.createStatus = 'pending'
            })
            .addCase(BookingCreateThunk.fulfilled, (state, action) => {
                state.createStatus = 'fulfilled'
                state.allData.push(action.payload);
            })
            .addCase(BookingCreateThunk.rejected, (state) => {
                state.error = true
                state.createStatus = 'rejected'
            })


            .addCase(BookingUpdateByIdThunk.pending, (state) => {
                state.updateStatus = 'pending'
            })
            .addCase(BookingUpdateByIdThunk.fulfilled, (state, action) => {
                state.updateStatus = 'fulfilled'
                const bookingToUpdate = action.payload;
                const index = state.allData.findIndex(booking => booking.id === bookingToUpdate.id);
                if (index !== -1) {
                    state.allData[index] = bookingToUpdate;
                }
                if (state.idData && state.idData.id === bookingToUpdate.id) {
                    state.idData = bookingToUpdate;
                }
            })
            .addCase(BookingUpdateByIdThunk.rejected, (state) => {
                state.error = true
                state.updateStatus = 'rejected'
            })

            .addCase(BookingDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = 'pending'
            })
            .addCase(BookingDeleteByIdThunk.fulfilled, (state, action) => {
                state.deleteStatus = 'fulfilled'
                const bookingIdToDelete = action.payload;
                state.allData = state.allData.filter(booking => booking.id !== bookingIdToDelete);
                if (state.idData && state.idData.id === bookingIdToDelete) {
                    state.idData = null;
                }
            })
            .addCase(BookingDeleteByIdThunk.rejected, (state) => {
                state.error = true
                state.deleteStatus = 'rejected'
            })
    }
})

export const getBookingAllData = (state) => state.bookingSlice.allData
export const getBookingIdData = (state) => state.bookingSlice.idData

export const getBookingAllStatus = (state) => state.bookingSlice.allStatus
export const getBookingIdStatus = (state) => state.bookingSlice.idStatus
export const getBookingCreateStatus = (state) => state.bookingSlice.createStatus
export const getBookingUpdateStatus = (state) => state.bookingSlice.updateStatus
export const getBookingDeleteStatus = (state) => state.bookingSlice.deleteStatus

export const getBookingError = (state) => state.bookingSlice.allError