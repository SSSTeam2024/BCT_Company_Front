import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Note {
    _id:string,
    title: string,
  message: string,
  pdf:string,
  id_corporate:string,
  pdfBase64String:string,
  pdfExtension:string,
  photo:string,
  photoBase64Strings:string,
  photoExtension:string
}
export const noteSlice = createApi({
    reducerPath: "Note",
    baseQuery: fetchBaseQuery({
      baseUrl: `${process.env.REACT_APP_BASE_URL}/api/notes/`,
    }),
    tagTypes: ["Note"],
    endpoints(builder) {
      return {
        fetchNote: builder.query<Note[], number | void>({
          query() {
            return `/getAllNotes`;
          },
          providesTags: ["Note"],
        }),
        fetchNotesByCompany: builder.query<Note[], { id_corporate: string }>({
          query({ id_corporate }) {
            return {
              url: `/getNotesByIdCompany`,
              method: "POST", 
              body: { id_corporate }, 
            };
          },
          providesTags: ["Note"],
        }),
        addNote: builder.mutation<void, Note>({
          query(payload) {
            return {
              url: "/newNote",
              method: "POST",
              body: payload,
            };
          },
          invalidatesTags: ["Note"],
        }),
        updateNote: builder.mutation<void, Note>({
          query: ({ _id, ...rest }) => ({
            url: `/updateNote/${_id}`,
            method: "PUT",
            body: rest,
          }),
          invalidatesTags: ["Note"],
        }),
        deleteNote: builder.mutation<void, number>({
          query: (_id) => ({
            url: `deleteNote/${_id}`,
            method: "DELETE",
          }),
          invalidatesTags: ["Note"],
        }),
      };
    },
  });
  
  export const {
    useAddNoteMutation,
    useFetchNoteQuery,
    useDeleteNoteMutation,
    useUpdateNoteMutation,
    useFetchNotesByCompanyQuery
  } = noteSlice;