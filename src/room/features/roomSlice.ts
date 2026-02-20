
import { createSlice } from '@reduxjs/toolkit'

import { resetStore } from '../../common/redux/rootActions'
import { ApiStatus } from '../../common/enums/ApiStatus'
import { RoomStateInterface } from '../interfaces/roomStateInterface'
import { RoomInterfaceId } from '../interfaces/roomInterface'
import { RootState } from '../../common/redux/store'
import { RoomFetchAllThunk } from './thunks/roomFetchAllThunk'
import { RoomFetchByIDThunk } from './thunks/roomFetchByIDThunk'
import { RoomCreateThunk } from './thunks/roomCreateThunk'
import { RoomUpdateThunk } from './thunks/roomUpdateThunk'
import { RoomArchiveThunk } from './thunks/roomArchiveThunk'
import { RoomDeleteByIdThunk } from './thunks/roomDeleteByIdThunk'
import { BookingCreateThunk } from '../../booking/features/thunks/bookingCreateThunk'
import { BookingArchiveThunk } from '../../booking/features/thunks/bookingArchiveThunk'
import { BookingDeleteByIdThunk } from '../../booking/features/thunks/bookingDeleteByIdThunk'


const initialState: RoomStateInterface = {
    allData: [] as RoomInterfaceId[],
    idData: {} as RoomInterfaceId,
    allStatus: ApiStatus.idle,
    idStatus: ApiStatus.idle,
    createStatus: ApiStatus.idle,
    updateStatus: ApiStatus.idle,
    archiveStatus: ApiStatus.idle,
    deleteStatus: ApiStatus.idle,
    apiError: null
}

export const RoomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        resetRoomAllStatus(state) {
            state.allStatus = ApiStatus.idle
            state.apiError = null
        },
        resetRoomIdStatus(state) {
            state.idStatus = ApiStatus.idle
            state.apiError = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(resetStore, () => initialState)

            .addCase(RoomFetchAllThunk.pending, (state) => {
                state.allStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(RoomFetchAllThunk.fulfilled, (state, action) => {
                state.allStatus = ApiStatus.fulfilled
                state.allData = action.payload
                state.apiError = null
            })
            .addCase(RoomFetchAllThunk.rejected, (state, action) => {
                state.allStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            .addCase(RoomFetchByIDThunk.pending, (state) => {
                state.idStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(RoomFetchByIDThunk.fulfilled, (state, action) => {
                state.idStatus = ApiStatus.fulfilled
                state.idData = action.payload
                state.apiError = null
            })
            .addCase(RoomFetchByIDThunk.rejected, (state, action) => {
                state.idStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            .addCase(RoomCreateThunk.pending, (state) => {
                state.createStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(RoomCreateThunk.fulfilled, (state, action) => {
                state.createStatus = ApiStatus.fulfilled
                state.allData.push(action.payload)
                state.apiError = null
            })
            .addCase(RoomCreateThunk.rejected, (state, action) => {
                state.createStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            .addCase(RoomUpdateThunk.pending, (state) => {
                state.updateStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(RoomUpdateThunk.fulfilled, (state, action) => {
                state.updateStatus = ApiStatus.fulfilled
                const updatedRoom = action.payload
                const index = state.allData.findIndex(r => r._id === updatedRoom._id)
                if (index !== -1) {
                    state.allData[index] = updatedRoom
                }
                if (state.idData?._id === updatedRoom._id) {
                    state.idData = updatedRoom
                }
                state.apiError = null
            })
            .addCase(RoomUpdateThunk.rejected, (state, action) => {
                state.updateStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            .addCase(RoomArchiveThunk.pending, (state) => {
                state.archiveStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(RoomArchiveThunk.fulfilled, (state, action) => {
                state.archiveStatus = ApiStatus.fulfilled
                const { roomUpdated } = action.payload
                const index = state.allData.findIndex(
                    room => room._id === roomUpdated._id
                )
                if (index !== -1) {
                    state.allData[index] = roomUpdated
                }
                if (state.idData && state.idData._id === roomUpdated._id) {
                    state.idData = roomUpdated
                }
                state.apiError = null
            })
            .addCase(RoomArchiveThunk.rejected, (state, action) => {
                state.archiveStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            .addCase(RoomDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = ApiStatus.pending
                state.apiError = null
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
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
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
            .addCase(BookingArchiveThunk.fulfilled, (state, action) => {
                const { updatedRooms } = action.payload
                if (!Array.isArray(updatedRooms) || updatedRooms.length === 0) return
                updatedRooms.forEach(updatedRoom => {
                    const index = state.allData.findIndex(r => r._id === updatedRoom._id)
                    if (index !== -1) state.allData[index] = updatedRoom
                    if (state.idData?._id === updatedRoom._id) {
                        state.idData = updatedRoom
                    }
                })
            })
            .addCase(BookingDeleteByIdThunk.fulfilled, (state, action) => {
                const updatedRooms = action.payload.updatedRooms
                if (!Array.isArray(updatedRooms) || updatedRooms.length === 0) return
                updatedRooms.forEach(updatedRoom => {
                    const index = state.allData.findIndex(r => r._id === updatedRoom._id)
                    if (index !== -1) state.allData[index] = updatedRoom
                    if (state.idData?._id === updatedRoom._id) state.idData = updatedRoom
                })
            })

    }
})

export const getRoomAllData = (state: RootState): RoomInterfaceId[] => state.roomSlice.allData
export const getRoomIdData = (state: RootState): RoomInterfaceId => state.roomSlice.idData
export const { resetRoomAllStatus, resetRoomIdStatus } = RoomSlice.actions

export const getRoomAllStatus = (state: RootState) => state.roomSlice.allStatus
export const getRoomIdStatus = (state: RootState) => state.roomSlice.idStatus
export const getRoomCreateStatus = (state: RootState) => state.roomSlice.createStatus
export const getRoomUpdateStatus = (state: RootState) => state.roomSlice.updateStatus
export const getRoomArchiveStatus = (state: RootState) => state.roomSlice.archiveStatus
export const getRoomDeleteStatus = (state: RootState) => state.roomSlice.deleteStatus

export const getRoomApiError = (state: RootState) => state.roomSlice.apiError