
import { createSlice } from '@reduxjs/toolkit';
import { RoomFetchAllThunk } from './thunks/roomFetchAllThunk';
import { RoomFetchByIDThunk } from './thunks/roomFetchByIDThunk';
import { RoomCreateThunk } from './thunks/roomCreateThunk';
import { RoomUpdateThunk } from './thunks/roomUpdateThunk';
import { RoomDeleteByIdThunk } from './thunks/roomDeleteByIdThunk'


export const RoomSlice = createSlice({
    name: 'room',
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
            .addCase(RoomFetchAllThunk.pending, (state) => {
                state.allStatus = 'pending'
            })
            .addCase(RoomFetchAllThunk.fulfilled, (state, action) => {
                state.allStatus = 'fulfilled'
                state.allData = action.payload
            })
            .addCase(RoomFetchAllThunk.rejected, (state) => {
                state.error = true
                state.allStatus = 'rejected'
            })

            .addCase(RoomFetchByIDThunk.pending, (state) => {
                state.idStatus = 'pending'
            })
            .addCase(RoomFetchByIDThunk.fulfilled, (state, action) => {
                state.idStatus = 'fulfilled'
                state.idData = action.payload
            })
            .addCase(RoomFetchByIDThunk.rejected, (state) => {
                state.error = true
                state.idStatus = 'rejected'
            })

            .addCase(RoomCreateThunk.pending, (state) => {
                state.createStatus = 'pending'
            })
            .addCase(RoomCreateThunk.fulfilled, (state, action) => {
                state.createStatus = 'fulfilled'
                state.allData.push(action.payload);
            })
            .addCase(RoomCreateThunk.rejected, (state) => {
                state.error = true
                state.createStatus = 'rejected'
            })


            .addCase(RoomUpdateThunk.pending, (state) => {
                state.updateStatus = 'pending'
            })
            .addCase(RoomUpdateThunk.fulfilled, (state, action) => {
                state.updateStatus = 'fulfilled'
                const roomToUpdate = action.payload;
                const index = state.allData.findIndex(room => room.id === roomToUpdate.id);
                if (index !== -1) {
                    state.allData[index] = roomToUpdate;
                }
                if (state.idData && state.idData.id === roomToUpdate.id) {
                    state.idData = roomToUpdate;
                }
            })
            .addCase(RoomUpdateThunk.rejected, (state) => {
                state.error = true
                state.updateStatus = 'rejected'
            })

            .addCase(RoomDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = 'pending'
            })
            .addCase(RoomDeleteByIdThunk.fulfilled, (state, action) => {
                state.deleteStatus = 'fulfilled'
                const roomIdToDelete = action.payload;
                state.allData = state.allData.filter(room => room.id !== roomIdToDelete);
                if (state.idData && state.idData.id === roomIdToDelete) {
                    state.idData = null;
                }
            })
            .addCase(RoomDeleteByIdThunk.rejected, (state) => {
                state.error = true
                state.deleteStatus = 'rejected'
            })
    }
})

export const getRoomAllData = (state) => state.roomSlice.allData
export const getRoomIdData = (state) => state.roomSlice.idData

export const getRoomAllStatus = (state) => state.roomSlice.allStatus
export const getRoomIdStatus = (state) => state.roomSlice.idStatus
export const getRoomCreateStatus = (state) => state.roomSlice.createStatus
export const getRoomUpdateStatus = (state) => state.roomSlice.updateStatus
export const getRoomDeleteStatus = (state) => state.roomSlice.deleteStatus

export const getRoomError = (state) => state.roomSlice.allError