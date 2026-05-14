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

    tagTypes: ["Employees", "Roles"],

  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),

    getMe: builder.query({
      query: () => "/getMe",
    }),

    login: builder.mutation({
      query: (data)=> ({
        url: "/login",
        method: "POST",
        body: data
      })
    }),

    getRoles: builder.query({
      query:()=>"/roleNameApi",
     providesTags : ["Roles"]
    }),

    getEmployeesByRole: builder.query({
      query: (roleName)=> ({
        url: "/roleSelectionEmployeeList",
        params: {roleName}
      })
    }),

    addEmployee: builder.mutation({
      query: (data)=> ({
        url: "/addNewEmployee",
        method: "POST",
        body: data,
        
      }),
      invalidatesTags: ["Employees"]
    }),

    getEmployees: builder.query({
      query:({page=1, limit=10})=>`/employeeData?page=${page}&limit=${limit}`,
      providesTags: ["Employees"]
    })
  }),
});

export const {useRegisterMutation, useGetMeQuery, useLoginMutation, useGetRolesQuery, useGetEmployeesByRoleQuery, useAddEmployeeMutation, useGetEmployeesQuery} = authApi;
