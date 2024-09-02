import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "app/store";

export interface UserResponse {
  //results: Account;
  company: {
    _id?: string;
    name: string,
    address: string,
    email: string,
    phone: string,
    activity: string,
    service_date: string,
    statusCompany: string,
    account_name: string,
    sort_code: string,
    account_number: string,
    bank_name: string,
    login: string,
    password: string,
    logo_file: string,
    legal_file: string,
    api_token: string
  };
}
export interface Account {
    _id?: string;
    name: string,
    address: string,
    email: string,
    phone: string,
    activity: string,
    service_date: string,
    statusCompany: string,
    account_name: string,
    sort_code: string,
    account_number: string,
    bank_name: string,
    login: string,
    password: string,
    logo_file: string,
    legal_file: string,
    api_token: string
    logoBase64String: string,
    logoExtension: string,
    legel_card_base64_string: string,
    legal_card_extension: string,
};

export interface LoginRequest {
  login: string;
  password: string;
}

export const accountSlice = createApi({
  reducerPath: "account",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/companies/`,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).auth?.company.api_token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Account"],
  endpoints(builder) {
    return {
      login: builder.mutation<UserResponse, LoginRequest>({
        query: (credentials) => ({
          url: "/loginCompany",
          method: "POST",
          body: credentials,
        }),
      }),
      updateAccount: builder.mutation<void, Account>({
        query: ({ _id, ...rest }) => ({
          url: `/updateCompany/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Account"],
      }),
   
    };
  },
});

export const {
  useUpdateAccountMutation,
  useLoginMutation,
} = accountSlice;