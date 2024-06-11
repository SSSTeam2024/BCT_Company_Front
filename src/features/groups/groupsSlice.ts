import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface GroupInterface {
    _id?:string,
    groupName: string,
    note:string,
    startPoint: string,
    dateStart: string,
    timeStart: string,
    Destination: string,
    dateEnd: string,
    timeEnd: string,
    status: string,
    id_company: string,
    program:string
    employees: {
      _id: string;
      firstName: string,
      lastName: string,
      photos:string,
      groupId?:string,
      groupJoiningDate?:string
  }[];
}

export interface AddEmployeesToGroupInterface {
  _id?:string,
  employees: string[]
}

export const groupSlice = createApi({
  reducerPath: "Group",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/groupEmployee/`,
  }),
  tagTypes: ["Group", "AddEmployeesToGroupInterface"],
  endpoints(builder) {
    return {
      fetchGroup: builder.query<GroupInterface[], number | void>({
        query() {
          return `/getAllGroups`;
        },
        providesTags: ["Group"],
      }),
      addGroup: builder.mutation<void, GroupInterface>({
        query(payload) {
          return {
            url: "/addNewGroup",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Group"],
      }),
      addEmployeesToGroup: builder.mutation<void, AddEmployeesToGroupInterface>({
        query: ({ _id, employees }) => ({
          url: "/addEmployeesToGroup",
          method: "POST",
          body: { _id, employees }, 
        }),
        invalidatesTags: ["Group", "AddEmployeesToGroupInterface"], 
      }),
      updateGroup: builder.mutation<void, GroupInterface>({
        query: ({ _id, ...rest }) => ({
          url: `/updateGroupById/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["Group"],
      }),
      deleteGroup: builder.mutation<void, number>({
        query: (_id) => ({
          url: `deleteGroup/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Group"],
      }),
    };
  },
});

export const {
  useAddGroupMutation,
  useFetchGroupQuery,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
  useAddEmployeesToGroupMutation
} = groupSlice;