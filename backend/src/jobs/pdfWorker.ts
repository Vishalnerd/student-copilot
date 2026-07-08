import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { processPdf } from "./pdfProcessor";

export const pdfWorker = new Worker(
  "pdf-processing",
  async (job) => {
    console.log(`📄 Processing Job ${job.id}`);

    await processPdf(job.data.noteId);
  },
  {
    connection: redisConnection as any,
    concurrency: 2,
  }
);

pdfWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

pdfWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed`, err);
});