import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authAPI.js";
import  authReducer  from "../features/auth/authSlice.js";

// export const store = configureStore({
//     reducer:{
//         auth: authReducer
//     }
// })

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(authApi.middleware);
  },
});
