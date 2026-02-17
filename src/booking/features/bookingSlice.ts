
import { createSlice } from '@reduxjs/toolkit'

import { resetStore } from '../../common/redux/rootActions'
import { ApiStatus } from '../../common/enums/ApiStatus'
import { BookingStateInterface } from '../interfaces/bookingStateInterface'
import { BookingInterfaceId } from '../interfaces/bookingInterface'
import { RootState } from '../../common/redux/store'
import { BookingFetchAllThunk } from './thunks/bookingFetchAllThunk'
import { BookingFetchByIDThunk } from './thunks/bookingFetchByIDThunk'
import { BookingCreateThunk } from './thunks/bookingCreateThunk'
import { BookingUpdateThunk } from './thunks/bookingUpdateThunk'
import { BookingDeleteByIdThunk } from './thunks/bookingDeleteByIdThunk'
import { RoomUpdateThunk } from '../../room/features/thunks/roomUpdateThunk'
import { RoomDeleteByIdThunk } from '../../room/features/thunks/roomDeleteByIdThunk'
import { ClientUpdateThunk } from '../../client/features/thunks/clientUpdateThunk'
import { ClientArchiveThunk } from '../../client/features/thunks/clientArchiveThunk'
import { ClientDeleteByIdThunk } from '../../client/features/thunks/clientDeleteByIdThunk'


const initialState: BookingStateInterface = {
    allData: [] as BookingInterfaceId[],
    idData: {} as BookingInterfaceId,
    allStatus: ApiStatus.idle,
    idStatus: ApiStatus.idle,
    createStatus: ApiStatus.idle,
    updateStatus: ApiStatus.idle,
    deleteStatus: ApiStatus.idle,
    apiError: null
}

export const BookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        resetBookingAllStatus(state) {
            state.allStatus = ApiStatus.idle
            state.apiError = null
        },
        resetBookingIdStatus(state) {
            state.idStatus = ApiStatus.idle
            state.apiError = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(resetStore, () => initialState)

            .addCase(BookingFetchAllThunk.pending, (state) => {
                state.allStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(BookingFetchAllThunk.fulfilled, (state, action) => {
                state.allStatus = ApiStatus.fulfilled
                state.allData = action.payload
                state.apiError = null
            })
            .addCase(BookingFetchAllThunk.rejected, (state, action) => {
                state.allStatus = ApiStatus.rejected
                state.apiError = action.payload ?? {
                    status: 500,
                    message: 'Unknown API error'
                }
            })

            .addCase(BookingFetchByIDThunk.pending, (state) => {
                state.idStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(BookingFetchByIDThunk.fulfilled, (state, action) => {
                state.idStatus = ApiStatus.fulfilled
                state.idData = action.payload
                state.apiError = null
            })
            .addCase(BookingFetchByIDThunk.rejected, (state, action) => {
                state.idStatus = ApiStatus.rejected
                state.apiError = action.payload ?? {
                    status: 500,
                    message: 'Unknown API error'
                }
            })

            .addCase(BookingCreateThunk.pending, (state) => {
                state.createStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(BookingCreateThunk.fulfilled, (state, action) => {
                state.createStatus = ApiStatus.fulfilled
                const { booking } = action.payload
                state.allData.push(booking)
                state.idData = booking
                state.apiError = null
            }
            )
            .addCase(BookingCreateThunk.rejected, (state, action) => {
                state.createStatus = ApiStatus.rejected
                state.apiError = action.payload ?? {
                    status: 500,
                    message: 'Unknown API error'
                }
            })

            .addCase(BookingUpdateThunk.pending, (state) => {
                state.updateStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(BookingUpdateThunk.fulfilled, (state, action) => {
                state.updateStatus = ApiStatus.fulfilled
                const { booking } = action.payload
                if (!booking) return
                const index = state.allData.findIndex(b => b._id === booking._id)
                if (index !== -1) {
                    state.allData[index] = booking
                }
                if (state.idData?._id === booking._id) {
                    state.idData = booking
                }
                state.apiError = null
            })
            .addCase(BookingUpdateThunk.rejected, (state, action) => {
                state.updateStatus = ApiStatus.rejected
                state.apiError = action.payload ?? {
                    status: 500,
                    message: 'Unknown API error'
                }
            })

            .addCase(BookingDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(BookingDeleteByIdThunk.fulfilled, (state, action) => {
                state.deleteStatus = ApiStatus.fulfilled
                const { bookingId } = action.payload
                state.allData = state.allData.filter(booking => booking._id !== bookingId)
                state.apiError = null
            })
            .addCase(BookingDeleteByIdThunk.rejected, (state, action) => {
                state.deleteStatus = ApiStatus.rejected
                state.apiError = action.payload ?? {
                    status: 500,
                    message: 'Unknown API error'
                }
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

            // CLIENT:
            .addCase(ClientUpdateThunk.fulfilled, (state, action) => {
                const { updatedBookings } = action.payload
                if (!Array.isArray(updatedBookings)) return

                updatedBookings.forEach(updatedBooking => {
                    const index = state.allData.findIndex(
                        b => b._id === updatedBooking._id
                    )
                    if (index !== -1) {
                        state.allData[index] = updatedBooking
                    }
                })
            })
            .addCase(ClientArchiveThunk.fulfilled, (state, action) => {
                const { updatedBookings } = action.payload
                if (!Array.isArray(updatedBookings)) return

                updatedBookings.forEach(updatedBooking => {
                    const index = state.allData.findIndex(
                        b => b._id === updatedBooking._id
                    )
                    if (index !== -1) {
                        state.allData[index] = updatedBooking
                    }
                })
            })
            .addCase(ClientDeleteByIdThunk.fulfilled, (state, action) => {
                const { updatedBookings } = action.payload
                if (!Array.isArray(updatedBookings)) return

                updatedBookings.forEach(updatedBooking => {
                    const index = state.allData.findIndex(
                        b => b._id === updatedBooking._id
                    )
                    if (index !== -1) {
                        state.allData[index] = updatedBooking
                    }
                })
            })

    }
})

export const getBookingAllData = (state: RootState): BookingInterfaceId[] => state.bookingSlice.allData
export const getBookingIdData = (state: RootState): BookingInterfaceId => state.bookingSlice.idData
export const { resetBookingAllStatus, resetBookingIdStatus } = BookingSlice.actions

export const getBookingAllStatus = (state: RootState) => state.bookingSlice.allStatus
export const getBookingIdStatus = (state: RootState) => state.bookingSlice.idStatus
export const getBookingCreateStatus = (state: RootState) => state.bookingSlice.createStatus
export const getBookingUpdateStatus = (state: RootState) => state.bookingSlice.updateStatus
export const getBookingDeleteStatus = (state: RootState) => state.bookingSlice.deleteStatus

export const getBookingApIError = (state: RootState) => state.bookingSlice.apiError