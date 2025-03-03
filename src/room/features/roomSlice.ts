
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ApiStatus } from '../../common/enums/ApiStatus.ts'
import { RoomStateInterface } from '../interfaces/roomStateInterface.ts'
import { RoomInterfaceBookings } from '../interfaces/roomInterface.ts'
import { RootState } from '../../common/redux/store.ts'
import { RoomFetchAllThunk } from './thunks/roomFetchAllThunk.ts'
import { RoomFetchByIDThunk } from './thunks/roomFetchByIDThunk.ts'
import { RoomCreateThunk } from './thunks/roomCreateThunk.ts'
import { RoomUpdateThunk } from './thunks/roomUpdateThunk.ts'
import { RoomDeleteByIdThunk } from './thunks/roomDeleteByIdThunk.ts'


export const RoomSlice = createSlice({
    name: 'room',
    initialState: {
        allData: [] as RoomInterfaceBookings[],
        idData: {} as RoomInterfaceBookings,
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
            .addCase(RoomFetchAllThunk.fulfilled, (state, action: PayloadAction<RoomInterfaceBookings[]>) => {
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
            .addCase(RoomFetchByIDThunk.fulfilled, (state, action: PayloadAction<RoomInterfaceBookings>) => {
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
            .addCase(RoomCreateThunk.fulfilled, (state, action: PayloadAction<RoomInterfaceBookings>) => {
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
            .addCase(RoomUpdateThunk.fulfilled, (state, action: PayloadAction<RoomInterfaceBookings>) => {
                state.updateStatus = ApiStatus.fulfilled
                const roomToUpdate = action.payload
                const index = state.allData.findIndex(room => room._id === roomToUpdate._id)
                if (index !== -1) {
                    state.allData[index] = roomToUpdate
                }
                if (state.idData && state.idData._id === roomToUpdate._id) {
                    state.idData = roomToUpdate
                }
            })
            .addCase(RoomUpdateThunk.rejected, (state) => {
                state.error = true
                state.updateStatus = ApiStatus.rejected
            })

            .addCase(RoomDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = ApiStatus.pending
            })
            .addCase(RoomDeleteByIdThunk.fulfilled, (state, action: PayloadAction<string>) => {
                state.deleteStatus = ApiStatus.fulfilled
                const roomIdToDelete = action.payload
                state.allData = state.allData.filter(room => room._id !== roomIdToDelete)
            })
            .addCase(RoomDeleteByIdThunk.rejected, (state) => {
                state.error = true
                state.deleteStatus = ApiStatus.rejected
            })
    }
})

export const getRoomAllData = (state: RootState): RoomInterfaceBookings[] => state.roomSlice.allData
export const getRoomIdData = (state: RootState): RoomInterfaceBookings => state.roomSlice.idData

export const getRoomAllStatus = (state: RootState) => state.roomSlice.allStatus
export const getRoomIdStatus = (state: RootState) => state.roomSlice.idStatus
export const getRoomCreateStatus = (state: RootState) => state.roomSlice.createStatus
export const getRoomUpdateStatus = (state: RootState) => state.roomSlice.updateStatus
export const getRoomDeleteStatus = (state: RootState) => state.roomSlice.deleteStatus

export const getRoomError = (state: RootState) => state.roomSlice.error