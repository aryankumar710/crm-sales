// import {API} from "../../services/axios.js"

// export const registerOrganisationApi = async(data) => {
//     const response = await API.post("/organisationRegister", data)
//     return response.data
// }

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    credentials: "include",
  }),

  tagTypes: ["Employees", "Roles", "Leads"],

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
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),

    getRoles: builder.query({
      query: () => "/roleNameApi",
      providesTags: ["Roles"],
    }),

    getEmployeesByRole: builder.query({
      query: (roleName) => ({
        url: "/roleSelectionEmployeeList",
        params: { roleName },
      }),
    }),

    addEmployee: builder.mutation({
      query: (data) => ({
        url: "/addNewEmployee",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Employees"],
    }),

    getEmployees: builder.query({
      query: ({ page, limit, roleName }) => ({
        url: "/employeeData",
        params: { page, limit, ...(roleName && { roleName }) },
      }),
      providesTags: ["Employees"],
    }),

    createRole: builder.mutation({
      query: (data) => ({
        url: "/createRole",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Roles"],
    }),

    getToken: builder.query({
      query: (token) => ({
        url: "/getInviteDetails",
        params: { token },
      }),
    }),

    getChangePasswordToken : builder.query({
      query: (token) => ({
        url: "/changePasswordToken",
        params: {token}
      })
    }),

    forgetPassword : builder.mutation({
      query: (data) => ({
        url: "/forgetPassword",
        body: data,
        method: "POST"
      })
    }),

    

    updateSuperAdmin: builder.mutation({
      query: (data) => ({
        url: "/setPassword",
        method: "PATCH",
        body: data,
      }),
    }),

    addLead: builder.mutation({
      query: (data) => ({
        url: "/addLead",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Leads"],
    }),

    getLeads: builder.query({
      query: ({ page, limit }) => ({
        url: "/getLeads",
        params: { page, limit },
      }),
      providesTags: ["Leads"],
    }),

    getTeam: builder.query({
      query: () => "/teamData",
    }),

    getProfile: builder.query({
      query: () => "/profileData",
    }),
    updateProfileData: builder.mutation({
      query: (data) => ({
        url: "/updateProfileData",
        body: data,
        method: "PATCH",
      }),
    }),
    changeProfilePhoto: builder.mutation({
      query: (data) => ({
        url: "/changeProfilePhoto",
        method: "PATCH",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST"
      }),
    }),
    changePassword : builder.mutation({
      query: (data) => ({
        url: "/changePassword",
        method: "POST",
        body : data
      })
    })
  })
});

export const {
  useRegisterMutation,
  useGetMeQuery,
  useLoginMutation,
  useGetRolesQuery,
  useGetEmployeesByRoleQuery,
  useAddEmployeeMutation,
  useGetEmployeesQuery,
  useCreateRoleMutation,
  useGetTokenQuery,
  useUpdateSuperAdminMutation,
  useAddLeadMutation,
  useGetLeadsQuery,
  useGetTeamQuery,
  useGetProfileQuery,
  useUpdateProfileDataMutation,
  useChangeProfilePhotoMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useForgetPasswordMutation,
  useGetChangePasswordTokenQuery
 
} = api;
