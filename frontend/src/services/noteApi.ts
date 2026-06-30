import { api } from "@/lib/axios";

export const getMyNotes = async () => {
  const response =
    await api.get("/notes/my-notes");

  return response.data;
};

export const uploadNote = async (
  file: File
) => {

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response =
    await api.post(
      "/notes/upload",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
};

export const getNoteById = async (
  id: string
) => {

  const response =
    await api.get(
      `/notes/${id}`
    );

  return response.data;
};

export const askQuestion =
 async (
  noteId:string,
  question:string
 ) => {

 const response =
  await api.post(
   `/notes/${noteId}/ask`,
   { question }
  );

 return response.data;
};

export const getChatHistory =
 async (
  noteId:string
 ) => {

  const response =
   await api.get(
    `/notes/${noteId}/chats`
   );

  return response.data;
};

export const deleteNote = async (
  id: string
) => {

  const response =
    await api.delete(
      `/notes/${id}`
    );

  return response.data;
};

export const searchNotes = async (
  query: string
) => {

  const response =
    await api.get(
      `/notes/search?q=${query}`
    );

  return response.data;

};

