
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ApiStatus } from '../../common/enums/ApiStatus.ts'
import { BookingStateInterface } from '../interfaces/bookingStateInterface.ts'
import { BookingInterfaceRoom } from '../interfaces/bookingInterface.ts'
import { RootState } from '../../common/redux/store.ts'
import { BookingFetchAllThunk } from './thunks/bookingFetchAllThunk.ts'
import { BookingFetchByIDThunk } from './thunks/bookingFetchByIDThunk.ts'
import { BookingCreateThunk } from './thunks/bookingCreateThunk.ts'
import { BookingUpdateThunk } from './thunks/bookingUpdateThunk.ts'
import { BookingDeleteByIdThunk } from './thunks/bookingDeleteByIdThunk.ts'


export const BookingSlice = createSlice({
    name: 'booking',
    initialState: {
        allData: [] as BookingInterfaceRoom[],
        idData: {} as BookingInterfaceRoom,
        allStatus: ApiStatus.idle,
        idStatus: ApiStatus.idle,
        createStatus: ApiStatus.idle,
        updateStatus: ApiStatus.idle,
        deleteStatus: ApiStatus.idle,
        error: false
    } as BookingStateInterface,
    reducers: {
        deleteBooking: (state, action: PayloadAction<number>) => {
            const idToDelete = action.payload
            state.allData = state.allData.filter(booking => booking._id !== idToDelete)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(BookingFetchAllThunk.pending, (state) => {
                state.allStatus = ApiStatus.pending
            })
            .addCase(BookingFetchAllThunk.fulfilled, (state, action: PayloadAction<BookingInterfaceRoom[]>) => {
                state.allStatus = ApiStatus.fulfilled
                state.allData = action.payload
            })
            .addCase(BookingFetchAllThunk.rejected, (state) => {
                state.error = true
                state.allStatus = ApiStatus.rejected
            })

            .addCase(BookingFetchByIDThunk.pending, (state) => {
                state.idStatus = ApiStatus.pending
            })
            .addCase(BookingFetchByIDThunk.fulfilled, (state, action: PayloadAction<BookingInterfaceRoom>) => {
                state.idStatus = ApiStatus.fulfilled
                state.idData = action.payload
            })
            .addCase(BookingFetchByIDThunk.rejected, (state) => {
                state.error = true
                state.idStatus = ApiStatus.rejected
            })

            .addCase(BookingCreateThunk.pending, (state) => {
                state.createStatus = ApiStatus.pending
            })
            .addCase(BookingCreateThunk.fulfilled, (state, action: PayloadAction<BookingInterfaceRoom>) => {
                state.createStatus = ApiStatus.fulfilled
                state.allData.push(action.payload)
            })
            .addCase(BookingCreateThunk.rejected, (state) => {
                state.error = true
                state.createStatus = ApiStatus.rejected
            })


            .addCase(BookingUpdateThunk.pending, (state) => {
                state.updateStatus = ApiStatus.pending
            })
            .addCase(BookingUpdateThunk.fulfilled, (state, action: PayloadAction<BookingInterfaceRoom>) => {
                state.updateStatus = ApiStatus.fulfilled
                const bookingToUpdate = action.payload
                const index = state.allData.findIndex(booking => booking._id === bookingToUpdate._id)
                if (index !== -1) {
                    state.allData[index] = bookingToUpdate
                }
                if (state.idData && state.idData._id === bookingToUpdate._id) {
                    state.idData = bookingToUpdate
                }
            })
            .addCase(BookingUpdateThunk.rejected, (state) => {
                state.error = true
                state.updateStatus = ApiStatus.rejected
            })

            .addCase(BookingDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = ApiStatus.pending
            })
            .addCase(BookingDeleteByIdThunk.fulfilled, (state, action: PayloadAction<number>) => {
                state.deleteStatus = ApiStatus.fulfilled
                const bookingIdToDelete = action.payload
                state.allData = state.allData.filter(booking => booking._id !== bookingIdToDelete)
            })
            .addCase(BookingDeleteByIdThunk.rejected, (state) => {
                state.error = true
                state.deleteStatus = ApiStatus.rejected
            })
    }
})

export const { deleteBooking } = BookingSlice.actions

export const getBookingAllData = (state: RootState): BookingInterfaceRoom[] => state.bookingSlice.allData
export const getBookingIdData = (state: RootState): BookingInterfaceRoom => state.bookingSlice.idData

export const getBookingAllStatus = (state: RootState) => state.bookingSlice.allStatus
export const getBookingIdStatus = (state: RootState) => state.bookingSlice.idStatus
export const getBookingCreateStatus = (state: RootState) => state.bookingSlice.createStatus
export const getBookingUpdateStatus = (state: RootState) => state.bookingSlice.updateStatus
export const getBookingDeleteStatus = (state: RootState) => state.bookingSlice.deleteStatus

export const getBookingError = (state: RootState) => state.bookingSlice.error