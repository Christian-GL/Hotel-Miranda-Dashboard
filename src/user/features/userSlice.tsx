
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ApiStatus } from '../../common/enums/ApiStatus'
import { UserInterface } from '../interfaces/user.interface'
import { RootState } from '../../common/redux/store'
import { UserFetchAllThunk } from './thunks/userFetchAllThunk'
import { UserFetchByIDThunk } from './thunks/userFetchByIDThunk'
import { UserCreateThunk } from './thunks/userCreateThunk'
import { UserUpdateThunk } from './thunks/userUpdateThunk'
import { UserDeleteByIdThunk } from './thunks/userDeleteByIdThunk'


export const UserSlice = createSlice({
    name: 'user',
    initialState: {
        allData: [] as UserInterface[],
        idData: {} as UserInterface | null,
        allStatus: ApiStatus.idle,
        idStatus: ApiStatus.idle,
        createStatus: ApiStatus.idle,
        updateStatus: ApiStatus.idle,
        deleteStatus: ApiStatus.idle,
        error: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(UserFetchAllThunk.pending, (state) => {
                state.allStatus = ApiStatus.pending
            })
            .addCase(UserFetchAllThunk.fulfilled, (state, action: PayloadAction<UserInterface[]>) => {
                state.allStatus = ApiStatus.fulfilled
                state.allData = action.payload
            })
            .addCase(UserFetchAllThunk.rejected, (state) => {
                state.error = true
                state.allStatus = ApiStatus.rejected
            })

            .addCase(UserFetchByIDThunk.pending, (state) => {
                state.idStatus = ApiStatus.pending
            })
            .addCase(UserFetchByIDThunk.fulfilled, (state, action: PayloadAction<UserInterface>) => {
                state.idStatus = ApiStatus.fulfilled
                state.idData = action.payload
            })
            .addCase(UserFetchByIDThunk.rejected, (state) => {
                state.error = true
                state.idStatus = ApiStatus.rejected
            })

            .addCase(UserCreateThunk.pending, (state) => {
                state.createStatus = ApiStatus.pending
            })
            .addCase(UserCreateThunk.fulfilled, (state, action: PayloadAction<UserInterface>) => {
                state.createStatus = ApiStatus.fulfilled
                state.allData.push(action.payload)
            })
            .addCase(UserCreateThunk.rejected, (state) => {
                state.error = true
                state.createStatus = ApiStatus.rejected
            })


            .addCase(UserUpdateThunk.pending, (state) => {
                state.updateStatus = ApiStatus.pending
            })
            .addCase(UserUpdateThunk.fulfilled, (state, action: PayloadAction<UserInterface>) => {
                state.updateStatus = ApiStatus.fulfilled
                const userToUpdate = action.payload
                const index = state.allData.findIndex(user => user.id === userToUpdate.id)
                if (index !== -1) {
                    state.allData[index] = userToUpdate
                }
                if (state.idData && state.idData.id === userToUpdate.id) {
                    state.idData = userToUpdate
                }
            })
            .addCase(UserUpdateThunk.rejected, (state) => {
                state.error = true
                state.updateStatus = ApiStatus.rejected
            })

            .addCase(UserDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = ApiStatus.pending
            })
            .addCase(UserDeleteByIdThunk.fulfilled, (state, action: PayloadAction<number>) => {
                state.deleteStatus = ApiStatus.fulfilled
                const userIdToDelete = action.payload
                state.allData = state.allData.filter(user => user.id !== userIdToDelete)
                if (state.idData && state.idData.id === userIdToDelete) {
                    state.idData = null
                }
            })
            .addCase(UserDeleteByIdThunk.rejected, (state) => {
                state.error = true
                state.deleteStatus = ApiStatus.rejected
            })
    }
})

export const getUserAllData = (state: RootState): UserInterface[] => state.userSlice.allData
export const getUserIdData = (state: RootState) => state.userSlice.idData

export const getUserAllStatus = (state: RootState) => state.userSlice.allStatus
export const getUserIdStatus = (state: RootState) => state.userSlice.idStatus
export const getUserCreateStatus = (state: RootState) => state.userSlice.createStatus
export const getUserUpdateStatus = (state: RootState) => state.userSlice.updateStatus
export const getUserDeleteStatus = (state: RootState) => state.userSlice.deleteStatus

export const getUserError = (state: RootState) => state.userSlice.error