
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
import { RoomUpdateResponseInterface } from '../../common/interfaces/apiResponses/roomUpdateResponseInterface'
import { RoomDeleteResponseInterface } from '../../common/interfaces/apiResponses/roomDeleteResponseInterface'


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
        errorMessage: null
    } as RoomStateInterface,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(RoomFetchAllThunk.pending, (state) => {
                state.allStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(RoomFetchAllThunk.fulfilled, (state, action: PayloadAction<RoomInterface[]>) => {
                state.allStatus = ApiStatus.fulfilled
                state.allData = action.payload
                state.errorMessage = null
            })
            .addCase(RoomFetchAllThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.allStatus = ApiStatus.rejected
                state.errorMessage = action.payload ?? 'Unknown error'
            })

            .addCase(RoomFetchByIDThunk.pending, (state) => {
                state.idStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(RoomFetchByIDThunk.fulfilled, (state, action: PayloadAction<RoomInterface>) => {
                state.idStatus = ApiStatus.fulfilled
                state.idData = action.payload
                state.errorMessage = null
            })
            .addCase(RoomFetchByIDThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.idStatus = ApiStatus.rejected
                state.errorMessage = action.payload ?? 'Unknown error'
            })

            .addCase(RoomCreateThunk.pending, (state) => {
                state.createStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(RoomCreateThunk.fulfilled, (state, action: PayloadAction<RoomInterface>) => {
                state.createStatus = ApiStatus.fulfilled
                state.allData.push(action.payload)
                state.errorMessage = null
            })
            .addCase(RoomCreateThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.createStatus = ApiStatus.rejected
                state.errorMessage = action.payload ?? 'Unknown error'
            })

            .addCase(RoomUpdateThunk.pending, (state) => {
                state.updateStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(RoomUpdateThunk.fulfilled, (state, action: PayloadAction<RoomUpdateResponseInterface>) => {
                state.updateStatus = ApiStatus.fulfilled
                const { roomUpdated } = action.payload
                if (!roomUpdated) return
                const index = state.allData.findIndex(r => r._id === roomUpdated._id)
                if (index !== -1) {
                    state.allData[index] = roomUpdated
                }
                if (state.idData?._id === roomUpdated._id) {
                    state.idData = roomUpdated
                }
                state.errorMessage = null
            })
            .addCase(RoomUpdateThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.updateStatus = ApiStatus.rejected
                state.errorMessage = action.payload ?? 'Unknown error'
            })

            .addCase(RoomDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(RoomDeleteByIdThunk.fulfilled, (state, action: PayloadAction<RoomDeleteResponseInterface>) => {
                state.deleteStatus = ApiStatus.fulfilled
                const { roomId } = action.payload
                state.allData = state.allData.filter(room => room._id !== roomId)
                if (state.idData?._id === roomId) {
                    state.idData = {} as RoomInterface
                }
            }
            )
            .addCase(RoomDeleteByIdThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.deleteStatus = ApiStatus.rejected
                state.errorMessage = action.payload ?? 'Unknown error'
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

export const getRoomErrorMessage = (state: RootState) => state.roomSlice.errorMessage