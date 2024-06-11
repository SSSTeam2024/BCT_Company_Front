import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Contract {
  _id?: string;
  contractName: string;
  invoiceFrequency: string;
  customerNotes: string;
  staffNotes: string;
  prices: string;
  salesperson: string;
  idProgram: string;
  idCompany: string;
  vehicleType: string;
  journeyType: string;
  luggageDetails: string;
  contractStatus: string;
  accountRef: string;
  accountName: string;
  accountEmail: string;
  accountPhone: string;
  effectiveDate: String,
  within_payment_days: string,
  contract_number: string,
  subTotal: string,
  tva: string,
  contractRef:string,
}

export const contractSlice = createApi({
  reducerPath: "contract",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/contract/`,
  }),
  tagTypes: ["Contract"],
  endpoints(builder) {
    return {
      getAllContracts: builder.query<Contract[], number | void>({
        query() {
          return "/getAllContracts";
        },
        providesTags: ["Contract"],
      }),
    };
  },
});

export const {
  useGetAllContractsQuery,
} = contractSlice;