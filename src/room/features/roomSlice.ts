
import { createSlice } from '@reduxjs/toolkit'

import { ApiStatus } from '../../common/enums/ApiStatus'
import { RoomStateInterface } from '../interfaces/roomStateInterface'
import { RoomInterfaceId } from '../interfaces/roomInterface'
import { RootState } from '../../common/redux/store'
import { RoomFetchAllThunk } from './thunks/roomFetchAllThunk'
import { RoomFetchByIDThunk } from './thunks/roomFetchByIDThunk'
import { RoomCreateThunk } from './thunks/roomCreateThunk'
import { RoomUpdateThunk } from './thunks/roomUpdateThunk'
import { RoomDeleteByIdThunk } from './thunks/roomDeleteByIdThunk'
import { BookingCreateThunk } from '../../booking/features/thunks/bookingCreateThunk'
import { BookingDeleteByIdThunk } from '../../booking/features/thunks/bookingDeleteByIdThunk'
import { BookingUpdateThunk } from '../../booking/features/thunks/bookingUpdateThunk'


export const RoomSlice = createSlice({
    name: 'room',
    initialState: {
        allData: [] as RoomInterfaceId[],
        idData: {} as RoomInterfaceId,
        allStatus: ApiStatus.idle,
        idStatus: ApiStatus.idle,
        createStatus: ApiStatus.idle,
        updateStatus: ApiStatus.idle,
        deleteStatus: ApiStatus.idle,
        errorMessage: null
    } as RoomStateInterface,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(RoomFetchAllThunk.pending, (state) => {
                state.allStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(RoomFetchAllThunk.fulfilled, (state, action) => {
                state.allStatus = ApiStatus.fulfilled
                state.allData = action.payload
                state.errorMessage = null
            })
            .addCase(RoomFetchAllThunk.rejected, (state, action) => {
                state.allStatus = ApiStatus.rejected
                state.errorMessage = action.payload?.message ?? 'Unknown error'
            })

            .addCase(RoomFetchByIDThunk.pending, (state) => {
                state.idStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(RoomFetchByIDThunk.fulfilled, (state, action) => {
                state.idStatus = ApiStatus.fulfilled
                state.idData = action.payload
                state.errorMessage = null
            })
            .addCase(RoomFetchByIDThunk.rejected, (state, action) => {
                state.idStatus = ApiStatus.rejected
                state.errorMessage = action.payload?.message ?? 'Unknown error'
            })

            .addCase(RoomCreateThunk.pending, (state) => {
                state.createStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(RoomCreateThunk.fulfilled, (state, action) => {
                state.createStatus = ApiStatus.fulfilled
                state.allData.push(action.payload)
                state.errorMessage = null
            })
            .addCase(RoomCreateThunk.rejected, (state, action) => {
                state.createStatus = ApiStatus.rejected
                state.errorMessage = action.payload?.message ?? 'Unknown error'
            })

            .addCase(RoomUpdateThunk.pending, (state) => {
                state.updateStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(RoomUpdateThunk.fulfilled, (state, action) => {
                state.updateStatus = ApiStatus.fulfilled
                const { roomUpdated } = action.payload
                if (!roomUpdated) return
                const index = state.allData.findIndex(r => r._id === roomUpdated._id)
                if (index !== -1) {
                    state.allData[index] = roomUpdated
                }
                if (state.idData && state.idData._id === roomUpdated._id) {
                    state.idData = roomUpdated
                }
                state.errorMessage = null
            })
            .addCase(RoomUpdateThunk.rejected, (state, action) => {
                state.updateStatus = ApiStatus.rejected
                state.errorMessage = action.payload?.message ?? 'Unknown error'
            })

            .addCase(RoomDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(RoomDeleteByIdThunk.fulfilled, (state, action) => {
                state.deleteStatus = ApiStatus.fulfilled
                const { roomId } = action.payload
                state.allData = state.allData.filter(room => room._id !== roomId)
                if (state.idData?._id === roomId) {
                    state.idData = {} as RoomInterfaceId
                }
            }
            )
            .addCase(RoomDeleteByIdThunk.rejected, (state, action) => {
                state.deleteStatus = ApiStatus.rejected
                state.errorMessage = action.payload?.message ?? 'Unknown error'
            })

            // BOOKING
            .addCase(BookingCreateThunk.fulfilled, (state, action) => {
                const updatedRooms = action.payload.updatedRooms ?? []
                updatedRooms.forEach(updatedRoom => {
                    const index = state.allData.findIndex(r => r._id === updatedRoom._id)
                    if (index !== -1) {
                        state.allData[index] = updatedRoom
                    }
                    if (state.idData?._id === updatedRoom._id) {
                        state.idData = updatedRoom
                    }
                })
            })
            .addCase(BookingUpdateThunk.fulfilled, (state, action) => {
                const updatedRooms = action.payload.updatedRooms ?? []
                updatedRooms.forEach(updatedRoom => {
                    const index = state.allData.findIndex(r => r._id === updatedRoom._id)
                    if (index !== -1) {
                        state.allData[index] = updatedRoom
                    }
                    if (state.idData?._id === updatedRoom._id) {
                        state.idData = updatedRoom
                    }
                })
            })
            .addCase(BookingDeleteByIdThunk.fulfilled, (state, action) => {
                const updatedRooms = action.payload.updatedRooms ?? []
                updatedRooms.forEach(updatedRoom => {
                    const index = state.allData.findIndex(r => r._id === updatedRoom._id)
                    if (index !== -1) {
                        state.allData[index] = updatedRoom
                    }
                    if (state.idData?._id === updatedRoom._id) {
                        state.idData = updatedRoom
                    }
                })
            })

    }
})

export const getRoomAllData = (state: RootState): RoomInterfaceId[] => state.roomSlice.allData
export const getRoomIdData = (state: RootState): RoomInterfaceId => state.roomSlice.idData

export const getRoomAllStatus = (state: RootState) => state.roomSlice.allStatus
export const getRoomIdStatus = (state: RootState) => state.roomSlice.idStatus
export const getRoomCreateStatus = (state: RootState) => state.roomSlice.createStatus
export const getRoomUpdateStatus = (state: RootState) => state.roomSlice.updateStatus
export const getRoomDeleteStatus = (state: RootState) => state.roomSlice.deleteStatus

export const getRoomErrorMessage = (state: RootState) => state.roomSlice.errorMessage