
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
import { ClientDeleteByIdThunk } from './thunks/clientDeleteByIdThunk'
import { BookingCreateThunk } from '../../booking/features/thunks/bookingCreateThunk'
import { BookingDeleteByIdThunk } from '../../booking/features/thunks/bookingDeleteByIdThunk'
import { BookingUpdateThunk } from '../../booking/features/thunks/bookingUpdateThunk'
import { RoomUpdateThunk } from '../../room/features/thunks/roomUpdateThunk'
import { RoomDeleteByIdThunk } from '../../room/features/thunks/roomDeleteByIdThunk'


const initialState: ClientStateInterface = {
    allData: [] as ClientInterfaceId[],
    idData: {} as ClientInterfaceId,
    allStatus: ApiStatus.idle,
    idStatus: ApiStatus.idle,
    createStatus: ApiStatus.idle,
    updateStatus: ApiStatus.idle,
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
                state.apiError = action.payload ?? {
                    status: 500,
                    message: 'Unknown API error'
                }
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
                state.apiError = action.payload ?? {
                    status: 500,
                    message: 'Unknown API error'
                }
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
                state.apiError = action.payload ?? {
                    status: 500,
                    message: 'Unknown API error'
                }
            })

            .addCase(ClientUpdateThunk.pending, (state) => {
                state.updateStatus = ApiStatus.pending
                state.apiError = null
            })
            .addCase(ClientUpdateThunk.fulfilled, (state, action) => {
                state.updateStatus = ApiStatus.fulfilled
                const { clientUpdated } = action.payload
                if (!clientUpdated) return
                const index = state.allData.findIndex(client => client._id === clientUpdated._id)
                if (index !== -1) {
                    state.allData[index] = clientUpdated
                }
                if (state.idData && state.idData._id === clientUpdated._id) {
                    state.idData = clientUpdated
                }
                state.apiError = null
            })
            .addCase(ClientUpdateThunk.rejected, (state, action) => {
                state.updateStatus = ApiStatus.rejected
                state.apiError = action.payload ?? {
                    status: 500,
                    message: 'Unknown API error'
                }
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
                state.apiError = action.payload ?? {
                    status: 500,
                    message: 'Unknown API error'
                }
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
            .addCase(BookingUpdateThunk.fulfilled, (state, action) => {
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
            .addCase(BookingDeleteByIdThunk.fulfilled, (state, action) => {
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

            // ROOM
            .addCase(RoomUpdateThunk.fulfilled, (state, action) => {
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
                if (updatedClients.length > 0) {
                    state.allData = [...state.allData]
                }
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
export const getClientDeleteStatus = (state: RootState) => state.clientSlice.deleteStatus

export const getClientApiError = (state: RootState) => state.clientSlice.apiError