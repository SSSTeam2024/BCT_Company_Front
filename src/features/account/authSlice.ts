import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Account } from "./accountSlice";
import type { RootState } from "../../app/store";

type AuthState = {
    company: {
      _id?: string;
      name: string;
      address: string;
      email: string;
      phone: string;
      activity: string;
      service_date: string;
      statusCompany: string;
      account_name: string;
      sort_code: string;
      account_number: string;
      bank_name: string;
      login: string;
      password: string;
      logoBase64String?: string;
      logoExtension?: string;
      logo_file: string;
      legel_card_base64_string?: string;
      legal_card_extension?: string;
      legal_file: string;
      api_token?: string;
      };
};

const slice = createSlice({
  name: "auth",
  initialState: { company: {
    _id: "",
    name: "",
    address: "",
    email:"" ,
    phone:"" ,
    activity: "",
    service_date: "",
    statusCompany:"" ,
    account_name: "",
    sort_code:"" ,
    account_number: "",
    bank_name: "",
    login:"" ,
    password: "",
    logo_file:"" ,
    legal_file: "",
    api_token:"",
    logoBase64String: "",
    logoExtension: "",
    legel_card_base64_string: "",
    legal_card_extension: "",
  } } as AuthState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: {  company },
      }: PayloadAction<{
        company: any}>
    ) => {
      state.company = company;
    },
  },
});

export const { setCredentials } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.company;