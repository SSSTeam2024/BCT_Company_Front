import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface VehicleType {
  _id?:string;
  type: string;
  base_change: string;
  coverage_mile: string
}

export const vehicleTypeSlice = createApi({
  reducerPath: "vehicleType",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/vehicleType`,
  }),
  tagTypes: ["VehicleType"],
  endpoints(builder) {
    return {
      getAllVehicleTypes: builder.query<VehicleType[], number | void>({
        query() {
          return "/getAllVehiclesTypes";
        },
        providesTags: ["VehicleType"],
      }),
      fetchVehicleTypeById: builder.query<VehicleType, string | void>({
        query: (_id) => ({
          url: `/getVehiclesType/${_id}`,
          method: "GET",
        }),
        providesTags: ["VehicleType"],
      }),
      addNewVehicleType: builder.mutation<void, VehicleType>({
        query(payload) {
          return {
            url: "/newVehicleType",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["VehicleType"],
      }),
      deleteVehicleType: builder.mutation<void, VehicleType>({
        query: (_id) => ({
            url: `/deleteVehicleType/${_id}`,
            method: "Delete",
        }),
        invalidatesTags: ["VehicleType"],
    }),
    };
  },
});

export const {
useGetAllVehicleTypesQuery,
useAddNewVehicleTypeMutation,
useDeleteVehicleTypeMutation,
useFetchVehicleTypeByIdQuery
} = vehicleTypeSlice;