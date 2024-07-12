import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface RequestFeature {
  _id?: string,
  company_id: string,
      subject: string,
      title: string,
      details: string,
      ref?: string,
      date: string,
      status: string,
      answer: string,
      featureImage_base64_string: string,
      featureImage_extension: string,
}

export const requestFeatureSlice = createApi({
  reducerPath: "requestFeature",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/request-feature`,
  }),
  tagTypes: ["RequestFeature"],
  endpoints(builder) {
    return {
      getAllRequestFeatures: builder.query<RequestFeature[], number | void>({
        query() {
          return "/getAllRequestFeatures";
        },
        providesTags: ["RequestFeature"],
      }),
      getAllRequestedFeaturesByCompanyID: builder.query<RequestFeature[], string | void>({
        query: (_id) => ({
                  url: `/getAllRequestedFeaturesByCompanyID/${_id}`,
                  method: "GET",
                }),
        providesTags: ["RequestFeature"],
      }),
    //   fetchShortCodeById: builder.query<ShortCode, string | void>({
    //     query: (_id) => ({
    //       url: `/getShortCodeById/${_id}`,
    //       method: "GET",
    //     }),
    //     providesTags: ["ShortCode"],
    //   }),
      addNewRequestFeature: builder.mutation<void, RequestFeature>({
        query(payload) {
          return {
            url: "/newRequestFeature",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["RequestFeature"],
      }),
      deleteShortCode: builder.mutation<void, RequestFeature>({
        query: (_id) => ({
          url: `/delete-short-code/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["RequestFeature"],
      }),
    };
  },
});

export const {
  useAddNewRequestFeatureMutation,
  useGetAllRequestFeaturesQuery,
  useGetAllRequestedFeaturesByCompanyIDQuery
} = requestFeatureSlice;
