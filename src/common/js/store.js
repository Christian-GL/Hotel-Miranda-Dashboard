import { configureStore } from "@reduxjs/toolkit";
// import { ApiPhotoListSlice } from "./features/apiSlice/apiPhotoListSlice";
// import { FavoritePhotoListSlice } from "./features/favoriteSlice/favoritePhotoSlice";

export const store = configureStore({
    reducer: {
        // apiPhotoList: ApiPhotoListSlice.reducer,
        // favoritePhotoList: FavoritePhotoListSlice.reducer
    }
})