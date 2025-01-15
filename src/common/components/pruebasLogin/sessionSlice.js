
import { createSlice } from '@reduxjs/toolkit';

export const SessionSlice = createSlice({

  name: 'session',
  initialState: {
    user: {},
    isLoggedIn: false
  },

  reducers: {
    signUp: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    editUser: (state, action) => {
      state.user = action.payload;
    },
    logOut: (state, action) => {
      state.user = {};
      state.isLoggedIn = false;
    }
  }

});

export const selectCurrentUser = (state) => state.session.user;
export const selectIsLoggedIn = (state) => state.session.isLoggedIn;
export const { signUp, logOut, editUser } = SessionSlice.actions;

export default SessionSlice.reducer;
// export const { sessionSlice2 } = ApiPhotoListSlice.actions