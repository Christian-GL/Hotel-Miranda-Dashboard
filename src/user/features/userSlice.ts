
import { createSlice } from '@reduxjs/toolkit'

import { resetStore } from '../../common/redux/rootActions'
import { ApiStatus } from '../../common/enums/ApiStatus'
import { UserStateInterface } from '../interfaces/userStateInterface'
import { UserInterfaceId } from '../interfaces/userInterface'
import { RootState } from '../../common/redux/store'
import { UserFetchAllThunk } from './thunks/userFetchAllThunk'
import { UserFetchByIDThunk } from './thunks/userFetchByIDThunk'
import { UserCreateThunk } from './thunks/userCreateThunk'
import { UserUpdateThunk } from './thunks/userUpdateThunk'
import { UserArchiveThunk } from './thunks/userArchiveThunk'
import { UserDeleteByIdThunk } from './thunks/userDeleteByIdThunk'


const initialState: UserStateInterface = {
    allData: [] as UserInterfaceId[],
    idData: {} as UserInterfaceId,
    allStatus: ApiStatus.idle,
    idStatus: ApiStatus.idle,
    createStatus: ApiStatus.idle,
    updateStatus: ApiStatus.idle,
    archiveStatus: ApiStatus.idle,
    deleteStatus: ApiStatus.idle,
    apiError: null
}

export const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetUserAllStatus(state) {
            state.allStatus = ApiStatus.idle
            state.apiError = null
        },
        resetUserIdStatus(state) {
            state.idStatus = ApiStatus.idle
            state.apiError = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(resetStore, () => initialState)

            .addCase(UserFetchAllThunk.pending, (state) => {
                state.allStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(UserFetchAllThunk.fulfilled, (state, action) => {
                state.allStatus = ApiStatus.fulfilled
                state.allData = action.payload
                state.apiError = null
            })
            .addCase(UserFetchAllThunk.rejected, (state, action) => {
                state.allStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            .addCase(UserFetchByIDThunk.pending, (state) => {
                state.idStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(UserFetchByIDThunk.fulfilled, (state, action) => {
                state.idStatus = ApiStatus.fulfilled
                state.idData = action.payload
                state.apiError = null
            })
            .addCase(UserFetchByIDThunk.rejected, (state, action) => {
                state.idStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            .addCase(UserCreateThunk.pending, (state) => {
                state.createStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(UserCreateThunk.fulfilled, (state, action) => {
                state.createStatus = ApiStatus.fulfilled
                state.allData.push(action.payload)
                state.apiError = null
            })
            .addCase(UserCreateThunk.rejected, (state, action) => {
                state.createStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            .addCase(UserUpdateThunk.pending, (state) => {
                state.updateStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(UserUpdateThunk.fulfilled, (state, action) => {
                state.updateStatus = ApiStatus.fulfilled
                const userToUpdate = action.payload
                const index = state.allData.findIndex(user => user._id === userToUpdate._id)
                if (index !== -1) {
                    state.allData[index] = userToUpdate
                }
                if (state.idData && state.idData._id === userToUpdate._id) {
                    state.idData = userToUpdate
                }
                state.apiError = null
            })
            .addCase(UserUpdateThunk.rejected, (state, action) => {
                state.updateStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            .addCase(UserArchiveThunk.pending, (state) => {
                state.archiveStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(UserArchiveThunk.fulfilled, (state, action) => {
                state.archiveStatus = ApiStatus.fulfilled
                const archivedUser = action.payload
                const index = state.allData.findIndex(user => user._id === archivedUser._id)
                if (index !== -1) {
                    state.allData[index] = archivedUser
                }
                if (state.idData && state.idData._id === archivedUser._id) {
                    state.idData = archivedUser
                }
                state.apiError = null
            })
            .addCase(UserArchiveThunk.rejected, (state, action) => {
                state.archiveStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            .addCase(UserDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(UserDeleteByIdThunk.fulfilled, (state, action) => {
                state.deleteStatus = ApiStatus.fulfilled
                const userIdToDelete = action.payload
                state.allData = state.allData.filter(user => user._id !== userIdToDelete)
                state.apiError = null
            })
            .addCase(UserDeleteByIdThunk.rejected, (state, action) => {
                state.deleteStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })
    }
})

export const getUserAllData = (state: RootState): UserInterfaceId[] => state.userSlice.allData
export const getUserIdData = (state: RootState): UserInterfaceId => state.userSlice.idData
export const { resetUserAllStatus, resetUserIdStatus } = UserSlice.actions

export const getUserAllStatus = (state: RootState) => state.userSlice.allStatus
export const getUserIdStatus = (state: RootState) => state.userSlice.idStatus
export const getUserCreateStatus = (state: RootState) => state.userSlice.createStatus
export const getUserUpdateStatus = (state: RootState) => state.userSlice.updateStatus
export const getUserArchiveStatus = (state: RootState) => state.userSlice.archiveStatus
export const getUserDeleteStatus = (state: RootState) => state.userSlice.deleteStatus

export const getUserApiError = (state: RootState) => state.userSlice.apiError