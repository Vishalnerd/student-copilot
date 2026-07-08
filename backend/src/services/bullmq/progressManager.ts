import { Response } from "express";

export interface ProgressUpdate {
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

class ProgressManager {

    private clients = new Map<string, Set<Response>>();

    private progress = new Map<string, ProgressUpdate>();

    send(noteId: string, progress: ProgressUpdate) {

        // Store latest state
        this.progress.set(noteId, progress);

        // Notify SSE clients
        const listeners = this.clients.get(noteId);

        if (!listeners) return;

        for (const client of listeners) {
            client.write(
                `data: ${JSON.stringify(progress)}\n\n`
            );
        }
    }

    get(noteId: string) {
        return this.progress.get(noteId);
    }

    clear(noteId: string) {
        this.progress.delete(noteId);
    }
    subscribe(noteId: string, res: Response) {
        if (!this.clients.has(noteId)) {
        this.clients.set(noteId, new Set());
        }

        this.clients.get(noteId)!.add(res);

        const latest = this.progress.get(noteId);
        if (latest) {
            res.write(`data: ${JSON.stringify(latest)}\n\n`);
        }
    }
    unsubscribe(noteId: string, res: Response) {
        const listeners = this.clients.get(noteId);
        if (!listeners) return;

        listeners.delete(res);

        if (listeners.size === 0) {
        this.clients.delete(noteId);
        }
    }

}

export const progressManager =
  new ProgressManager();