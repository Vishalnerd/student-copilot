// types/Progress.ts

export interface Progress {
  status:
    | "queued"
    | "extracting"
    | "chunking"
    | "embedding"
    | "saving"
    | "completed"
    | "failed";

  progress: number;

  message: string;
}