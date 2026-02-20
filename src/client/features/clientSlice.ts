
import { createSlice } from '@reduxjs/toolkit'

import { resetStore } from '../../common/redux/rootActions'
import { ApiStatus } from '../../common/enums/ApiStatus'
import { ClientStateInterface } from '../interfaces/clientStateInterface'
import { ClientInterfaceId } from '../interfaces/clientInterface'
import { RootState } from '../../common/redux/store'
import { ClientFetchAllThunk } from './thunks/clientFetchAllThunk'
import { ClientFetchByIDThunk } from './thunks/clientFetchByIDThunk'
import { ClientCreateThunk } from './thunks/clientCreateThunk'
import { ClientUpdateThunk } from './thunks/clientUpdateThunk'
import { ClientArchiveThunk } from './thunks/clientArchiveThunk'
import { ClientDeleteByIdThunk } from './thunks/clientDeleteByIdThunk'
import { BookingCreateThunk } from '../../booking/features/thunks/bookingCreateThunk'
import { BookingDeleteByIdThunk } from '../../booking/features/thunks/bookingDeleteByIdThunk'
import { BookingArchiveThunk } from '../../booking/features/thunks/bookingArchiveThunk'
import { RoomArchiveThunk } from '../../room/features/thunks/roomArchiveThunk'
import { RoomDeleteByIdThunk } from '../../room/features/thunks/roomDeleteByIdThunk'


const initialState: ClientStateInterface = {
    allData: [] as ClientInterfaceId[],
    idData: {} as ClientInterfaceId,
    allStatus: ApiStatus.idle,
    idStatus: ApiStatus.idle,
    createStatus: ApiStatus.idle,
    updateStatus: ApiStatus.idle,
    archiveStatus: ApiStatus.idle,
    deleteStatus: ApiStatus.idle,
    apiError: null
}

export const ClientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        resetClientAllStatus(state) {
            state.allStatus = ApiStatus.idle
            state.apiError = null
        },
        resetClientIdStatus(state) {
            state.idStatus = ApiStatus.idle
            state.apiError = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(resetStore, () => initialState)

            .addCase(ClientFetchAllThunk.pending, (state) => {
                state.allStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(ClientFetchAllThunk.fulfilled, (state, action) => {
                state.allStatus = ApiStatus.fulfilled
                state.allData = action.payload
                state.apiError = null
            })
            .addCase(ClientFetchAllThunk.rejected, (state, action) => {
                state.allStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            .addCase(ClientFetchByIDThunk.pending, (state) => {
                state.idStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(ClientFetchByIDThunk.fulfilled, (state, action) => {
                state.idStatus = ApiStatus.fulfilled
                state.idData = action.payload
                state.apiError = null
            })
            .addCase(ClientFetchByIDThunk.rejected, (state, action) => {
                state.idStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            .addCase(ClientCreateThunk.pending, (state) => {
                state.createStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(ClientCreateThunk.fulfilled, (state, action) => {
                state.createStatus = ApiStatus.fulfilled
                state.allData.push(action.payload)
                state.apiError = null
            })
            .addCase(ClientCreateThunk.rejected, (state, action) => {
                state.createStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            .addCase(ClientUpdateThunk.pending, (state) => {
                state.updateStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(ClientUpdateThunk.fulfilled, (state, action) => {
                state.updateStatus = ApiStatus.fulfilled
                const updatedClient = action.payload
                const index = state.allData.findIndex(c => c._id === updatedClient._id)
                if (index !== -1) {
                    state.allData[index] = updatedClient
                }
                if (state.idData?._id === updatedClient._id) {
                    state.idData = updatedClient
                }
                state.apiError = null
            })
            .addCase(ClientUpdateThunk.rejected, (state, action) => {
                state.updateStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            .addCase(ClientArchiveThunk.pending, (state) => {
                state.archiveStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(ClientArchiveThunk.fulfilled, (state, action) => {
                state.archiveStatus = ApiStatus.fulfilled
                const { clientUpdated } = action.payload
                const index = state.allData.findIndex(
                    user => user._id === clientUpdated._id
                )
                if (index !== -1) {
                    state.allData[index] = clientUpdated
                }
                if (state.idData && state.idData._id === clientUpdated._id) {
                    state.idData = clientUpdated
                }
                state.apiError = null
            })
            .addCase(ClientArchiveThunk.rejected, (state, action) => {
                state.archiveStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            .addCase(ClientDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(ClientDeleteByIdThunk.fulfilled, (state, action) => {
                state.deleteStatus = ApiStatus.fulfilled
                const { clientId } = action.payload
                state.allData = state.allData.filter(client => client._id !== clientId)
                state.apiError = null
            })
            .addCase(ClientDeleteByIdThunk.rejected, (state, action) => {
                state.deleteStatus = ApiStatus.rejected
                state.apiError = action.payload ?? { status: 500, message: 'Unknown API error' }
            })

            // BOOKING:
            .addCase(BookingCreateThunk.fulfilled, (state, action) => {
                const { updatedClient } = action.payload
                if (!updatedClient) return
                const index = state.allData.findIndex(c => c._id === updatedClient._id)
                if (index !== -1) {
                    state.allData[index] = updatedClient
                }
                if (state.idData?._id === updatedClient._id) {
                    state.idData = updatedClient
                }
            })
            .addCase(BookingArchiveThunk.fulfilled, (state, action) => {
                const { updatedClient } = action.payload
                if (!updatedClient) return
                const index = state.allData.findIndex(c => c._id === updatedClient._id)
                if (index !== -1) state.allData[index] = updatedClient
                if (state.idData?._id === updatedClient._id) {
                    state.idData = updatedClient
                }
            })
            .addCase(BookingDeleteByIdThunk.fulfilled, (state, action) => {
                const updatedClient = action.payload.updatedClient
                if (!updatedClient) return
                const index = state.allData.findIndex(c => c._id === updatedClient._id)
                if (index !== -1) state.allData[index] = updatedClient
                if (state.idData?._id === updatedClient._id) state.idData = updatedClient
            })

            // ROOM
            .addCase(RoomArchiveThunk.fulfilled, (state, action) => {
                const { updatedClients } = action.payload
                updatedClients.forEach(client => {
                    const index = state.allData.findIndex(c => c._id === client._id)
                    if (index !== -1) {
                        state.allData[index] = client
                    }
                    if (state.idData?._id === client._id) {
                        state.idData = client
                    }
                })
            })
            .addCase(RoomDeleteByIdThunk.fulfilled, (state, action) => {
                const updatedClients = action.payload.updatedClients ?? []

                updatedClients.forEach(client => {
                    const index = state.allData.findIndex(c => c._id === client._id)
                    if (index !== -1) {
                        state.allData[index] = client
                    }
                    if (state.idData?._id === client._id) {
                        state.idData = client
                    }
                })
            })

    }
})

export const getClientAllData = (state: RootState): ClientInterfaceId[] => state.clientSlice.allData
export const getClientIdData = (state: RootState): ClientInterfaceId => state.clientSlice.idData
export const { resetClientAllStatus, resetClientIdStatus } = ClientSlice.actions

export const getClientAllStatus = (state: RootState) => state.clientSlice.allStatus
export const getClientIdStatus = (state: RootState) => state.clientSlice.idStatus
export const getClientCreateStatus = (state: RootState) => state.clientSlice.createStatus
export const getClientUpdateStatus = (state: RootState) => state.clientSlice.updateStatus
export const getClientArchiveStatus = (state: RootState) => state.clientSlice.archiveStatus
export const getClientDeleteStatus = (state: RootState) => state.clientSlice.deleteStatus

export const getClientApiError = (state: RootState) => state.clientSlice.apiError