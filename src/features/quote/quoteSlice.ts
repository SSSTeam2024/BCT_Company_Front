import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Quote {
  _id?: string;
  passengers_number: number;
  journey_type: string;
  pickup_time: string;
  return_time: string;
  destination_point: {
    placeName: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  start_point: {
    placeName: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  mid_stations: string[];
  vehicle_type: string;
  id_visitor: string;
  notes: string;
  createdAt: string;
  luggage_details: string;
  manual_cost: string;
  status: string;
  progress: string;
  balance: string;
  deposit: string;
  id_driver: string;
  id_vehicle: string;
  total_price: string,
  deposit_percentage: string,
  automatic_cost: string,
  deposit_amount: string,
  date:string

}

export const quoteSlice = createApi({
  reducerPath: "quote",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/quote`,
  }),
  tagTypes: ["Quote"],
  endpoints(builder) {
    return {
      getAllQuote: builder.query<Quote[], number | void>({
        query() {
          return "/getAllQuotes";
        },
        providesTags: ["Quote"],
      }),
      getQuoteById: builder.query<Quote, number | void>({
        query: (_id) => ({
          url: `/getQuoteById/${_id}`,
          method: "GET",
        }),
        providesTags: ["Quote"],
      }),
      getQuoteByIdSchedule: builder.query<Quote[], { id_schedule: string }>({
        query: ({id_schedule}) => ({
          url: `/getQuoteByIdSchedule`,
          method: "POST",
          body:{id_schedule: id_schedule}
        }),
        providesTags: ["Quote"],
      }),
      getAllQuotesByCompanyID: builder.query<Quote[], string | void>({
        query: (_id) => ({
          url: `/getAllQuotesByCompanyID/${_id}`,
          method: "GET",
        }),
        providesTags: ["Quote"],
      }),
    };
  },
});

export const {
  useGetAllQuoteQuery,
  useGetQuoteByIdQuery,
  useGetQuoteByIdScheduleQuery,
  useGetAllQuotesByCompanyIDQuery
} = quoteSlice;