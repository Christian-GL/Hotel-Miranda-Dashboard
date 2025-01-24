
import { createSlice } from '@reduxjs/toolkit';
import { UserFetchAllThunk } from './thunks/userFetchAllThunk'
import { UserFetchByIDThunk } from './thunks/userFetchByIDThunk';
import { UserCreateThunk } from './thunks/userCreateThunk';
import { UserUpdateByIdThunk } from './thunks/userUpdateByIdThunk';
import { UserDeleteByIdThunk } from './thunks/userDeleteByIdThunk'


export const UserSlice = createSlice({
    name: 'user',
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
            .addCase(UserFetchAllThunk.pending, (state) => {
                state.allStatus = 'pending'
            })
            .addCase(UserFetchAllThunk.fulfilled, (state, action) => {
                state.allStatus = 'fulfilled'
                state.allData = action.payload
            })
            .addCase(UserFetchAllThunk.rejected, (state) => {
                state.error = true
                state.allStatus = 'rejected'
            })

            .addCase(UserFetchByIDThunk.pending, (state) => {
                state.idStatus = 'pending'
            })
            .addCase(UserFetchByIDThunk.fulfilled, (state, action) => {
                state.idStatus = 'fulfilled'
                state.idData = action.payload
            })
            .addCase(UserFetchByIDThunk.rejected, (state) => {
                state.error = true
                state.idStatus = 'rejected'
            })

            .addCase(UserCreateThunk.pending, (state) => {
                state.createStatus = 'pending'
            })
            .addCase(UserCreateThunk.fulfilled, (state, action) => {
                state.createStatus = 'fulfilled'
                state.allData.push(action.payload);
            })
            .addCase(UserCreateThunk.rejected, (state) => {
                state.error = true
                state.createStatus = 'rejected'
            })


            .addCase(UserUpdateByIdThunk.pending, (state) => {
                state.updateStatus = 'pending'
            })
            .addCase(UserUpdateByIdThunk.fulfilled, (state, action) => {
                state.updateStatus = 'fulfilled'
                const userToUpdate = action.payload;
                const index = state.allData.findIndex(user => user.id === userToUpdate.id);
                if (index !== -1) {
                    state.allData[index] = userToUpdate;
                }
                if (state.idData && state.idData.id === userToUpdate.id) {
                    state.idData = userToUpdate;
                }
            })
            .addCase(UserUpdateByIdThunk.rejected, (state) => {
                state.error = true
                state.updateStatus = 'rejected'
            })

            .addCase(UserDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = 'pending'
            })
            .addCase(UserDeleteByIdThunk.fulfilled, (state, action) => {
                state.deleteStatus = 'fulfilled'
                const userIdToDelete = action.payload;
                state.allData = state.allData.filter(user => user.id !== userIdToDelete);
                if (state.idData && state.idData.id === userIdToDelete) {
                    state.idData = null;
                }
            })
            .addCase(UserDeleteByIdThunk.rejected, (state) => {
                state.error = true
                state.deleteStatus = 'rejected'
            })
    }
})

export const getUserAllData = (state) => state.userSlice.allData
export const getUserIdData = (state) => state.userSlice.idData

export const getUserAllStatus = (state) => state.userSlice.allStatus
export const getUserIdStatus = (state) => state.userSlice.idStatus
export const getUserCreateStatus = (state) => state.userSlice.createStatus
export const getUserUpdateStatus = (state) => state.userSlice.updateStatus
export const getUserDeleteStatus = (state) => state.userSlice.deleteStatus

export const getUserError = (state) => state.userSlice.allError