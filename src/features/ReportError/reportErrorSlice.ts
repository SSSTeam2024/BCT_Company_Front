import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ErrorReport {
  _id?: string,
  company_id?: string,
      school_id?: string,
      section: string,
      title: string,
      details: string,
      ref?: string,
      date: string,
      status: string,
      answer: string,
      errorImage?: string,
      errorImage_base64_string: string,
      errorImage_extension: string,
}

export const errorReportSlice = createApi({
  reducerPath: "errorReport",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/error-report`,
  }),
  tagTypes: ["ErrorReport"],
  endpoints(builder) {
    return {
      getAllErrorReports: builder.query<ErrorReport[], number | void>({
        query() {
          return "/getAllErrorReports";
        },
        providesTags: ["ErrorReport"],
      }),
      getAllErrorReportsByCompanyID: builder.query<ErrorReport[], string | void>({
        query: (_id) => ({
                  url: `/getAllErrorReportsByCompanyID/${_id}`,
                  method: "GET",
                }),
        providesTags: ["ErrorReport"],
      }),
      addNewErrorReport: builder.mutation<void, ErrorReport>({
        query(payload) {
          return {
            url: "/newErrorReport",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["ErrorReport"],
      }),
      deleteErrorReport: builder.mutation<void, ErrorReport>({
        query: (_id) => ({
          url: `/deleteErrorReport/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["ErrorReport"],
      }),
    };
  },
});

export const {
  useAddNewErrorReportMutation,
  useGetAllErrorReportsQuery,
  useGetAllErrorReportsByCompanyIDQuery
} = errorReportSlice;
