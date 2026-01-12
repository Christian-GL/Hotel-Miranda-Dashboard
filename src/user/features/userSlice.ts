
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ApiStatus } from '../../common/enums/ApiStatus'
import { UserStateInterface } from '../interfaces/userStateInterface'
import { UserInterface } from '../interfaces/userInterface'
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
        idData: {} as UserInterface,
        allStatus: ApiStatus.idle,
        idStatus: ApiStatus.idle,
        createStatus: ApiStatus.idle,
        updateStatus: ApiStatus.idle,
        deleteStatus: ApiStatus.idle,
        errorMessage: null
    } as UserStateInterface,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(UserFetchAllThunk.pending, (state) => {
                state.allStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(UserFetchAllThunk.fulfilled, (state, action: PayloadAction<UserInterface[]>) => {
                state.allStatus = ApiStatus.fulfilled
                state.allData = action.payload
                state.errorMessage = null
            })
            .addCase(UserFetchAllThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.allStatus = ApiStatus.rejected
                state.errorMessage = action.payload ?? 'Unknown error'
            })

            .addCase(UserFetchByIDThunk.pending, (state) => {
                state.idStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(UserFetchByIDThunk.fulfilled, (state, action: PayloadAction<UserInterface>) => {
                state.idStatus = ApiStatus.fulfilled
                state.idData = action.payload
                state.errorMessage = null
            })
            .addCase(UserFetchByIDThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.idStatus = ApiStatus.rejected
                state.errorMessage = action.payload ?? 'Unknown error'
            })

            .addCase(UserCreateThunk.pending, (state) => {
                state.createStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(UserCreateThunk.fulfilled, (state, action: PayloadAction<UserInterface>) => {
                state.createStatus = ApiStatus.fulfilled
                state.allData.push(action.payload)
                state.errorMessage = null
            })
            .addCase(UserCreateThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.createStatus = ApiStatus.rejected
                state.errorMessage = action.payload ?? 'Unknown error'
            })

            .addCase(UserUpdateThunk.pending, (state) => {
                state.updateStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(UserUpdateThunk.fulfilled, (state, action: PayloadAction<UserInterface>) => {
                state.updateStatus = ApiStatus.fulfilled
                const userToUpdate = action.payload
                const index = state.allData.findIndex(user => user._id === userToUpdate._id)
                if (index !== -1) {
                    state.allData[index] = userToUpdate
                }
                if (state.idData && state.idData._id === userToUpdate._id) {
                    state.idData = userToUpdate
                }
                state.errorMessage = null
            })
            .addCase(UserUpdateThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.updateStatus = ApiStatus.rejected
                state.errorMessage = action.payload ?? 'Unknown error'
            })

            .addCase(UserDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(UserDeleteByIdThunk.fulfilled, (state, action: PayloadAction<string>) => {
                state.deleteStatus = ApiStatus.fulfilled
                const userIdToDelete = action.payload
                state.allData = state.allData.filter(user => user._id !== userIdToDelete)
                state.errorMessage = null
            })
            .addCase(UserDeleteByIdThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.deleteStatus = ApiStatus.rejected
                state.errorMessage = action.payload ?? 'Unknown error'
            })
    }
})

export const getUserAllData = (state: RootState): UserInterface[] => state.userSlice.allData
export const getUserIdData = (state: RootState): UserInterface => state.userSlice.idData

export const getUserAllStatus = (state: RootState) => state.userSlice.allStatus
export const getUserIdStatus = (state: RootState) => state.userSlice.idStatus
export const getUserCreateStatus = (state: RootState) => state.userSlice.createStatus
export const getUserUpdateStatus = (state: RootState) => state.userSlice.updateStatus
export const getUserDeleteStatus = (state: RootState) => state.userSlice.deleteStatus

export const getUserErrorMessage = (state: RootState) => state.userSlice.errorMessage