
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ApiStatus } from '../../common/enums/ApiStatus'
import { RoomStateInterface } from '../interfaces/roomStateInterface'
import { RoomInterface } from '../interfaces/roomInterface'
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
        allData: [] as RoomInterface[],
        idData: {} as RoomInterface,
        allStatus: ApiStatus.idle,
        idStatus: ApiStatus.idle,
        createStatus: ApiStatus.idle,
        updateStatus: ApiStatus.idle,
        deleteStatus: ApiStatus.idle,
        error: false
    } as RoomStateInterface,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(RoomFetchAllThunk.pending, (state) => {
                state.allStatus = ApiStatus.pending
            })
            .addCase(RoomFetchAllThunk.fulfilled, (state, action: PayloadAction<RoomInterface[]>) => {
                state.allStatus = ApiStatus.fulfilled
                state.allData = action.payload
            })
            .addCase(RoomFetchAllThunk.rejected, (state) => {
                state.error = true
                state.allStatus = ApiStatus.rejected
            })

            .addCase(RoomFetchByIDThunk.pending, (state) => {
                state.idStatus = ApiStatus.pending
            })
            .addCase(RoomFetchByIDThunk.fulfilled, (state, action: PayloadAction<RoomInterface>) => {
                state.idStatus = ApiStatus.fulfilled
                state.idData = action.payload
            })
            .addCase(RoomFetchByIDThunk.rejected, (state) => {
                state.error = true
                state.idStatus = ApiStatus.rejected
            })

            .addCase(RoomCreateThunk.pending, (state) => {
                state.createStatus = ApiStatus.pending
            })
            .addCase(RoomCreateThunk.fulfilled, (state, action: PayloadAction<RoomInterface>) => {
                state.createStatus = ApiStatus.fulfilled
                state.allData.push(action.payload)
            })
            .addCase(RoomCreateThunk.rejected, (state) => {
                state.error = true
                state.createStatus = ApiStatus.rejected
            })

            .addCase(RoomUpdateThunk.pending, (state) => {
                state.updateStatus = ApiStatus.pending
            })
            .addCase(RoomUpdateThunk.fulfilled, (state, action) => {
                state.updateStatus = ApiStatus.fulfilled
                const { room } = action.payload
                const index = state.allData.findIndex(r => r._id === room._id)
                if (index !== -1) {
                    state.allData[index] = room
                }
                if (state.idData?._id === room._id) {
                    state.idData = room
                }
            })
            .addCase(RoomUpdateThunk.rejected, (state) => {
                state.error = true
                state.updateStatus = ApiStatus.rejected
            })

            .addCase(RoomDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = ApiStatus.pending
            })
            .addCase(RoomDeleteByIdThunk.fulfilled, (state, action) => {
                state.deleteStatus = ApiStatus.fulfilled
                const { roomId } = action.payload
                state.allData = state.allData.filter(room => room._id !== roomId)
                if (state.idData?._id === roomId) {
                    state.idData = {} as RoomInterface
                }
            })
            .addCase(RoomDeleteByIdThunk.rejected, (state) => {
                state.error = true
                state.deleteStatus = ApiStatus.rejected
            })

            // BOOKING
            .addCase(BookingCreateThunk.fulfilled, (state, action) => {
                const updatedRooms: RoomInterface[] = action.payload.updatedRooms
                updatedRooms.forEach(updatedRoom => {
                    const index = state.allData.findIndex(r => r._id === updatedRoom._id)
                    if (index !== -1) {
                        state.allData[index] = updatedRoom
                    }
                })
            })
            .addCase(BookingUpdateThunk.fulfilled, (state, action) => {
                const updatedRooms: RoomInterface[] = action.payload.updatedRooms
                updatedRooms.forEach(updatedRoom => {
                    const index = state.allData.findIndex(r => r._id === updatedRoom._id)
                    if (index !== -1) {
                        state.allData[index] = updatedRoom
                    }
                })
            })
            .addCase(BookingDeleteByIdThunk.fulfilled, (state, action) => {
                const { updatedRooms } = action.payload
                updatedRooms.forEach((updatedRoom: RoomInterface) => {
                    const index = state.allData.findIndex(r => r._id === updatedRoom._id)
                    if (index !== -1) {
                        state.allData[index] = updatedRoom
                    }
                })
            })

    }
})

export const getRoomAllData = (state: RootState): RoomInterface[] => state.roomSlice.allData
export const getRoomIdData = (state: RootState): RoomInterface => state.roomSlice.idData

export const getRoomAllStatus = (state: RootState) => state.roomSlice.allStatus
export const getRoomIdStatus = (state: RootState) => state.roomSlice.idStatus
export const getRoomCreateStatus = (state: RootState) => state.roomSlice.createStatus
export const getRoomUpdateStatus = (state: RootState) => state.roomSlice.updateStatus
export const getRoomDeleteStatus = (state: RootState) => state.roomSlice.deleteStatus

export const getRoomError = (state: RootState) => state.roomSlice.error