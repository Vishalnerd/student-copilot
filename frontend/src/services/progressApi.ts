import { Progress } from "@/types/Progress";

export function subscribeToProgress(
  noteId: string,
  onProgress: (progress: Progress) => void,
  onComplete?: () => void
) {
  // Append token directly to the URL query string
  const eventSource = new EventSource(
    `${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}/progress/stream`,
    { withCredentials: true }
  );

  eventSource.onmessage = (event) => {
    const progress: Progress = JSON.parse(event.data);
    onProgress(progress);

    if (progress.status === "completed" || progress.status === "failed") {
      eventSource.close();
      onComplete?.();
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE Connection Error:", err); // Debug log to see the drop
    eventSource.close();
  };

  return eventSource;
}