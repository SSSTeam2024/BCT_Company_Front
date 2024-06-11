import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Programm {
  programDetails: {
    _id?: string;
    programName: string;
    origin_point: {
      placeName: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    stops: {
      id: string;
      address: {
        placeName: string;
        coordinates: {
          lat: number;
          lng: number;
        };
      };
      time: string;
    }[];
    destination_point: {
      placeName: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    pickUp_date: string;
    droppOff_date: string;
    freeDays_date: string[];
    exceptDays: string[];
    recommanded_capacity: string;
    extra: string[];
    notes: string;
    dropOff_time: string;
    pickUp_Time: string;
    school_id?: string;
    company_id?: string;
    luggage?: string;
    vehiculeType?: string;
    unit_price?: string;
    total_price?: string;
    journeyType?: string;
    program_status?: {
      status: string;
      date_status: string;
    }[];
    within_payment_days?: string;
    invoiceFrequency?: string;
    notes_for_client?: {
      msg: string;
      date: string;
      sender: string;
    }[];
  };
  groups: {
    type: string;
    groupCollection: {
      id_company?: string;
      passenger_number?: string;
      groupName: string;
      student_number?: string;
      id_school?: string;
      vehicle_type: string;
      luggage_details: string;
      program?: string;
    }[];
  };
}

export interface ProgrammGroups {
  _id?: string;
  programName: string;
  origin_point: {
    placeName: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  stops: {
    id: string;
    address: string;
    time: string;
  }[];
  destination_point: {
    placeName: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  pickUp_date: string;
  droppOff_date: string;
  freeDays_date: string[];
  exceptDays: string[];
  recommanded_capacity: string;
  extra: string[];
  notes: string;
  dropOff_time: string;
  pickUp_Time: string;
  school_id?: string;
  company_id?: string;
  luggage?: string;
  vehiculeType?: string;
  unit_price?: string;
  total_price?: string;
  journeyType?: string;
  program_status?: {
    status: string;
    date_status: string;
  }[];
  within_payment_days?: string;
  invoiceFrequency?: string;
  notes_for_client?: {
    msg: string;
    date: string;
    sender: string;
  }[];
}

export interface SendResponse {
  id: string;
  notes_for_client: {
    msg: string;
    date: string;
    sender: string;
  }[];
  unit_price: string;
  total_price: string;
  program_status: {
    status: string;
    date_status: string;
  }[];
  invoiceFrequency: string;
  within_payment_days?: string;
}

export interface ConvertTo {
  idProgram: String;
}

export interface ConvertToQuote {
  id_schedule: String;
}

export interface UpdateStatus {
  id: string;
  status: string;
}

export interface GroupInterface {
  _id?: string;
  groupName: string;
  note: string;
  startPoint: string;
  dateStart: string;
  timeStart: string;
  Destination: string;
  dateEnd: string;
  timeEnd: string;
  status: string;
  id_school: string;
  program: string;
  employees: {
    _id: string;
    firstName: string;
    lastName: string;
    id_file: string;
    groupId?: string;
    groupJoiningDate?: string;
  }[];
}

export const programmSlice = createApi({
  reducerPath: "programm",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/programm`,
  }),
  tagTypes: [
    "Programm",
    "SendResponse",
    "ConvertTo",
    "ConvertToQuote",
    "UpdateStatus",
    "ProgrammGroups",
    "GroupInterface"
  ],
  endpoints(builder) {
    return {
      fetchProgramms: builder.query<ProgrammGroups[], number | void>({
        query() {
          return `/getAllProgramms`;
        },
        providesTags: ["ProgrammGroups"],
      }),
      fetchProgrammById: builder.query<Programm, string | void>({
        query: (_id) => ({
          url: `/getProgrammById/${_id}`,
          method: "GET",
        }),
        providesTags: ["Programm"],
      }),
      addProgramm: builder.mutation<void, Programm>({
        query(payload) {
          return {
            url: "/newProgramm",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Programm"],
      }),
      fetchGroupEmployeeByIdGroup: builder.query<GroupInterface[], string | void>({
        query: (_id) => ({
          url: `/get-program-groups-employees/${_id}`,
          method: "GET",
        }),
        providesTags: ["GroupInterface"],
      }),

      sendResponse: builder.mutation<void, SendResponse>({
        query({
          id,
          notes_for_client,
          unit_price,
          total_price,
          program_status,
          invoiceFrequency,
          within_payment_days,
        }) {
          return {
            url: "/sendResponse",
            method: "POST",
            body: {
              id,
              notes_for_client,
              unit_price,
              total_price,
              program_status,
              invoiceFrequency,
              within_payment_days,
            },
          };
        },
        invalidatesTags: ["Programm", "SendResponse"],
      }),
      convertToContract: builder.mutation<void, ConvertTo>({
        query({ idProgram }) {
          return {
            url: "/toContract",
            method: "POST",
            body: {
              idProgram,
            },
          };
        },
        invalidatesTags: ["Programm", "ConvertTo"],
      }),
      convertToQuote: builder.mutation<void, ConvertToQuote>({
        query({ id_schedule }) {
          return {
            url: "/convertToQuote",
            method: "POST",
            body: {
              id_schedule,
            },
          };
        },
        invalidatesTags: ["Programm", "ConvertToQuote"],
      }),
      updateStatus: builder.mutation<void, UpdateStatus>({
        query({ id, status }) {
          return {
            url: "/statusToConverted",
            method: "POST",
            body: {
              id,
              status,
            },
          };
        },
        invalidatesTags: ["Programm", "UpdateStatus"],
      }),
      deleteProgram: builder.mutation<void, string>({
        query: (_id) => ({
          url: `/deleteProgram/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Programm"],
      }),
    };
  },
});

export const {
  useAddProgrammMutation,
  useFetchProgrammsQuery,
  useFetchProgrammByIdQuery,
  useSendResponseMutation,
  useConvertToContractMutation,
  useConvertToQuoteMutation,
  useDeleteProgramMutation,
  useUpdateStatusMutation,
  useFetchGroupEmployeeByIdGroupQuery
} = programmSlice;