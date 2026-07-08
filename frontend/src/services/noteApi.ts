import { api } from "@/lib/axios";
import {authenticatedFetch} from "@/utils/authenticatedFetch";
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

export const streamChat = async (
  noteId: string,
  question: string,
  onToken: (token: string) => void
) => {
  
  const response = await authenticatedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}/stream`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Streaming failed");
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");

    buffer = events.pop() ?? "";

    for (const event of events) {
      const lines = event.split("\n");

      let eventName = "message";
      let data = "";

      for (const line of lines) {
        if (line.startsWith("event:")) {
          eventName = line.replace("event:", "").trim();
        }

        if (line.startsWith("data:")) {
          data += line.replace("data:", "").trim();
        }
      }

      if (eventName === "done") {
        return;
      }

      if (!data) continue;

      try {
        const payload = JSON.parse(data);

        if (payload.token) {
          onToken(payload.token);
        }
      } catch {
        console.warn("Invalid SSE payload:", data);
      }
    }
  }
};

