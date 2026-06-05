import { configureStore } from "@reduxjs/toolkit";
import { api } from "../features/API/api.js";
import  authReducer  from "../features/API/slice.js";

// export const store = configureStore({
//     reducer:{
//         auth: authReducer
//     }
// })

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(api.middleware);
  },
});
