// import {API} from "../../services/axios.js"

// export const registerOrganisationApi = async(data) => {
//     const response = await API.post("/organisationRegister", data)
//     return response.data
// }

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    credentials: "include"
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),

    getme: builder.query({
      query: () => "/me",
    }),
  }),
});

export const {useRegisterMutation} = authApi;
