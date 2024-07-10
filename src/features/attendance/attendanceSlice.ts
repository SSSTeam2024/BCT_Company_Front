import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface EmployeeAttendance {
  _id?: string;
  id_quote: string;
  id_employee: string;
  id_company: string;
  presence: string;
}

export const employeeAttendanceSlice = createApi({
  reducerPath: "employeeAttendance",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/employeeAttendance`,
  }),
  tagTypes: ["EmployeeAttendance"],
  endpoints(builder) {
    return {
        getAttendanceByIdCompany: builder.mutation<EmployeeAttendance[], { id_company: string }>({
            query: (payload) => ({
              url: '/getAttendanceByIdCompany',
              method: 'POST',
              body: payload,
            }),
            invalidatesTags: ['EmployeeAttendance'],
          }),
          getAttendanceByIdEmployee: builder.mutation<EmployeeAttendance[], { id_employee: string }>({
        query(payload) {
          return {
            url: "/getAttendanceByIdEmployee",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["EmployeeAttendance"],
      }),
      getAttendancesByEmployeeIdsAndQuoteId: builder.mutation<void, EmployeeAttendance>({
        query(payload) {
          return {
            url: "/newLuggage",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["EmployeeAttendance"],
      }),
    };
  },
});

export const {
useGetAttendanceByIdCompanyMutation,
useGetAttendanceByIdEmployeeMutation,
useGetAttendancesByEmployeeIdsAndQuoteIdMutation,
} = employeeAttendanceSlice;