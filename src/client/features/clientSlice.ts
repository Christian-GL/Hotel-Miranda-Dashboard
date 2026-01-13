
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ApiStatus } from '../../common/enums/ApiStatus'
import { ClientStateInterface } from '../interfaces/clientStateInterface'
import { ClientInterface } from '../interfaces/clientInterface'
import { RootState } from '../../common/redux/store'
import { ClientFetchAllThunk } from './thunks/clientFetchAllThunk'
import { ClientFetchByIDThunk } from './thunks/clientFetchByIDThunk'
import { ClientCreateThunk } from './thunks/clientCreateThunk'
import { ClientUpdateThunk } from './thunks/clientUpdateThunk'
import { ClientDeleteByIdThunk } from './thunks/clientDeleteByIdThunk'
import { BookingCreateThunk } from '../../booking/features/thunks/bookingCreateThunk'
import { BookingDeleteByIdThunk } from '../../booking/features/thunks/bookingDeleteByIdThunk'
import { BookingUpdateThunk } from '../../booking/features/thunks/bookingUpdateThunk'


export const ClientSlice = createSlice({
    name: 'client',
    initialState: {
        allData: [] as ClientInterface[],
        idData: {} as ClientInterface,
        allStatus: ApiStatus.idle,
        idStatus: ApiStatus.idle,
        createStatus: ApiStatus.idle,
        updateStatus: ApiStatus.idle,
        deleteStatus: ApiStatus.idle,
        errorMessage: null
    } as ClientStateInterface,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(ClientFetchAllThunk.pending, (state) => {
                state.allStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(ClientFetchAllThunk.fulfilled, (state, action: PayloadAction<ClientInterface[]>) => {
                state.allStatus = ApiStatus.fulfilled
                state.allData = action.payload
                state.errorMessage = null
            })
            .addCase(ClientFetchAllThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.allStatus = ApiStatus.rejected
                state.errorMessage = action.payload ?? 'Unknown error'
            })

            .addCase(ClientFetchByIDThunk.pending, (state) => {
                state.idStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(ClientFetchByIDThunk.fulfilled, (state, action: PayloadAction<ClientInterface>) => {
                state.idStatus = ApiStatus.fulfilled
                state.idData = action.payload
                state.errorMessage = null
            })
            .addCase(ClientFetchByIDThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.idStatus = ApiStatus.rejected
                state.errorMessage = action.payload ?? 'Unknown error'
            })

            .addCase(ClientCreateThunk.pending, (state) => {
                state.createStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(ClientCreateThunk.fulfilled, (state, action: PayloadAction<ClientInterface>) => {
                state.createStatus = ApiStatus.fulfilled
                state.allData.push(action.payload)
                state.errorMessage = null
            })
            .addCase(ClientCreateThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.createStatus = ApiStatus.rejected
                state.errorMessage = action.payload ?? 'Unknown error'
            })

            .addCase(ClientUpdateThunk.pending, (state) => {
                state.updateStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(ClientUpdateThunk.fulfilled, (state, action: PayloadAction<ClientInterface>) => {
                state.updateStatus = ApiStatus.fulfilled
                const clientToUpdate = action.payload
                const index = state.allData.findIndex(client => client._id === clientToUpdate._id)
                if (index !== -1) {
                    state.allData[index] = clientToUpdate
                }
                if (state.idData && state.idData._id === clientToUpdate._id) {
                    state.idData = clientToUpdate
                }
                state.errorMessage = null
            })
            .addCase(ClientUpdateThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.updateStatus = ApiStatus.rejected
                state.errorMessage = action.payload ?? 'Unknown error'
            })

            .addCase(ClientDeleteByIdThunk.pending, (state) => {
                state.deleteStatus = ApiStatus.pending
                state.errorMessage = null
            })
            .addCase(ClientDeleteByIdThunk.fulfilled, (state, action: PayloadAction<string>) => {
                state.deleteStatus = ApiStatus.fulfilled
                const clientIdToDelete = action.payload
                state.allData = state.allData.filter(client => client._id !== clientIdToDelete)
                state.errorMessage = null
            })
            .addCase(ClientDeleteByIdThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.deleteStatus = ApiStatus.rejected
                state.errorMessage = action.payload ?? 'Unknown error'
            })

            // BOOKING:
            .addCase(BookingCreateThunk.fulfilled, (state, action) => {
                const updatedClient = action.payload.updatedClient
                if (state.idData && state.idData._id === updatedClient._id) {
                    state.idData = updatedClient
                }
            })
            .addCase(BookingUpdateThunk.fulfilled, (state, action) => {
                const updatedClient = action.payload.updatedClient
                if (state.idData && state.idData._id === updatedClient._id) {
                    state.idData = updatedClient
                }
            })
            .addCase(BookingDeleteByIdThunk.fulfilled, (state, action) => {
                const updatedClient = action.payload.updatedClient
                if (state.idData && state.idData._id === updatedClient._id) {
                    state.idData = updatedClient
                }
                const index = state.allData.findIndex(client => client._id === updatedClient._id)
                if (index !== -1) {
                    state.allData[index] = updatedClient
                }
            })
    }
})

export const getClientAllData = (state: RootState): ClientInterface[] => state.clientSlice.allData
export const getClientIdData = (state: RootState): ClientInterface => state.clientSlice.idData

export const getClientAllStatus = (state: RootState) => state.clientSlice.allStatus
export const getClientIdStatus = (state: RootState) => state.clientSlice.idStatus
export const getClientCreateStatus = (state: RootState) => state.clientSlice.createStatus
export const getClientUpdateStatus = (state: RootState) => state.clientSlice.updateStatus
export const getClientDeleteStatus = (state: RootState) => state.clientSlice.deleteStatus

export const getClientErrorMessage = (state: RootState) => state.clientSlice.errorMessage