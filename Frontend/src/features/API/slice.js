import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// export const registerOrganisation = createAsyncThunk(
//   "auth/registerOrganisation",
//   async (organisationData, thunkAPI) => {
//     try {
//       const data = await registerOrganisationApi(organisationData);
//       return data;
//     } catch (e) {
//       return thunkAPI.rejectWithValue(
//         e.response?.data || "Registeration Failed",
//       );
//     }
//   },
// );

// const initialState = {
//   organisation: null,
//   isAuthenticated: false,
//   loading: false,
//   error: null,
//   success: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,

//   reducers: {
//     resetAuthState: (state) => {
//       state.loading = false;
//       state.error = null;
//       state.success = false;
//     },
//     logout: (state) => {
//       state.organisation = null;
//       state.isAuthenticated = false;
//       state.error = null;
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(registerOrganisation.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })

//       .addCase(registerOrganisation.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         state.organisation = action.payload.organisation;
//         state.isAuthenticated = true;
//       })

//       .addCase(registerOrganisation.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { resetAuthState, logout } = authSlice.actions;
// export default authSlice.reducer;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    employee: null,
  },
  reducers: {
    setEmployee: (state, action) => {
      state.employee = action.payload;
    },
    clearUser: (state) => {
      state.wmployee = null;
    },
  },
});

export const { setEmployee, clearUser } = authSlice.actions;
export default authSlice.reducer;
