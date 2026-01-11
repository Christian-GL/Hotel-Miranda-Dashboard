
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ApiStatus } from '../../common/enums/ApiStatus'
import { BookingStateInterface } from '../interfaces/bookingStateInterface'
import { BookingInterface } from '../interfaces/bookingInterface'
import { RootState } from '../../common/redux/store'
import { BookingFetchAllThunk } from './thunks/bookingFetchAllThunk'
import { BookingFetchByIDThunk } from './thunks/bookingFetchByIDThunk'
import { BookingCreateThunk } from './thunks/bookingCreateThunk'
import { BookingUpdateThunk } from './thunks/bookingUpdateThunk'
import { BookingDeleteByIdThunk } from './thunks/bookingDeleteByIdThunk'
import { RoomUpdateThunk } from '../../room/features/thunks/roomUpdateThunk'
import { RoomDeleteByIdThunk } from '../../room/features/thunks/roomDeleteByIdThunk'
import { ClientInterface } from '../../client/interfaces/clientInterface'
import { RoomInterface } from '../../room/interfaces/roomInterface'


export const BookingSlice = createSlice({
    name: 'booking',
    initialState: {
        allData: [] as BookingInterface[],
        idData: {} as BookingInterface,
        allStatus: ApiStatus.idle,
        idStatus: ApiStatus.idle,
        createStatus: ApiStatus.idle,
        updateStatus: ApiStatus.idle,
        deleteStatus: ApiStatus.idle,
        error: false
    } as BookingStateInterface,
    reducers: {
        deleteBooking: (state, action: PayloadAction<string>) => {
            const idToDelete = action.payload
            state.allData = state.allData.filter(booking => booking._id !== idToDelete)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(BookingFetchAllThunk.pending, (state) => {
                state.allStatus = ApiStatus.pending
            })
            .addCase(BookingFetchAllThunk.fulfilled, (state, action: PayloadAction<BookingInterface[]>) => {
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
            .addCase(BookingFetchByIDThunk.fulfilled, (state, action: PayloadAction<BookingInterface>) => {
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
            .addCase(BookingCreateThunk.fulfilled, (state, action: PayloadAction<{
                booking: BookingInterface
                updatedRooms: RoomInterface[]
                updatedClient: ClientInterface
            }>) => {
                state.createStatus = ApiStatus.fulfilled
                state.allData.push(action.payload.booking)
            })
            .addCase(BookingCreateThunk.rejected, (state) => {
                state.error = true
                state.createStatus = ApiStatus.rejected
            })

            .addCase(BookingUpdateThunk.pending, (state) => {
                state.updateStatus = ApiStatus.pending
            })
            .addCase(BookingUpdateThunk.fulfilled, (state, action: PayloadAction<{
                booking: BookingInterface
                updatedRooms: RoomInterface[]
                updatedClient: ClientInterface
            }>) => {
                state.updateStatus = ApiStatus.fulfilled

                const bookingToUpdate = action.payload.booking
                const index = state.allData.findIndex(b => b._id === bookingToUpdate._id)
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
            .addCase(BookingDeleteByIdThunk.fulfilled, (state, action) => {
                state.deleteStatus = ApiStatus.fulfilled
                const { bookingId } = action.payload
                state.allData = state.allData.filter(booking => booking._id !== bookingId)
            })
            .addCase(BookingDeleteByIdThunk.rejected, (state) => {
                state.error = true
                state.deleteStatus = ApiStatus.rejected
            })

            // ROOM:
            .addCase(RoomUpdateThunk.fulfilled, (state, action) => {
                const { updatedBookings } = action.payload

                updatedBookings.forEach(updatedBooking => {
                    const index = state.allData.findIndex(b => b._id === updatedBooking._id)
                    if (index !== -1) {
                        state.allData[index] = updatedBooking
                    }
                })
            })
            .addCase(RoomDeleteByIdThunk.fulfilled, (state, action) => {
                action.payload.updatedBookings.forEach(booking => {
                    const index = state.allData.findIndex(b => b._id === booking._id)
                    if (index !== -1) {
                        state.allData[index] = booking
                    }
                })
            })
    }
})

export const { deleteBooking } = BookingSlice.actions

export const getBookingAllData = (state: RootState): BookingInterface[] => state.bookingSlice.allData
export const getBookingIdData = (state: RootState): BookingInterface => state.bookingSlice.idData

export const getBookingAllStatus = (state: RootState) => state.bookingSlice.allStatus
export const getBookingIdStatus = (state: RootState) => state.bookingSlice.idStatus
export const getBookingCreateStatus = (state: RootState) => state.bookingSlice.createStatus
export const getBookingUpdateStatus = (state: RootState) => state.bookingSlice.updateStatus
export const getBookingDeleteStatus = (state: RootState) => state.bookingSlice.deleteStatus

export const getBookingError = (state: RootState) => state.bookingSlice.error