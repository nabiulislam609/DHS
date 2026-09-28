/**
 * Background Queue Worker Module (BullMQ / Celery abstraction)
 * Handles background operations such as SMS dispatch, PDF rendering,
 * and Welcome account email notifications.
 */

export interface QueueJob<T = any> {
  id: string;
  name: string;
  data: T;
  status: 'WAITING' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  progress: number;
  result?: any;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

class BackgroundQueue {
  private jobs: QueueJob[] = [];

  public async addJob<T>(name: string, data: T): Promise<QueueJob<T>> {
    const job: QueueJob<T> = {
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      data,
      status: 'WAITING',
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    this.jobs.unshift(job);
    if (this.jobs.length > 100) this.jobs.pop(); // keep last 100

    // Process asynchronously in background
    setTimeout(() => this.processJob(job.id), 100);

    return job;
  }

  private async processJob(jobId: string): Promise<void> {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return;

    job.status = 'ACTIVE';
    job.progress = 25;

    try {
      if (job.name === 'SEND_ADMISSION_SMS') {
        // Simulate SMS gateway call
        await new Promise((resolve) => setTimeout(resolve, 300));
        job.progress = 80;
        job.result = {
          recipient: job.data.phone,
          message: `Congratulations ${job.data.applicantName}! Your admission is APPROVED. Student ID: ${job.data.studentId}, Password: ${job.data.defaultPassword}`,
          dispatchedAt: new Date().toISOString(),
          gatewayStatus: 'DELIVERED',
        };
      } else if (job.name === 'GENERATE_MARKSHEET_PDF') {
        await new Promise((resolve) => setTimeout(resolve, 400));
        job.progress = 90;
        job.result = {
          pdfUrl: `/generated/marksheet-${job.data.studentId}-${job.data.examName}.pdf`,
          generatedAt: new Date().toISOString(),
        };
      } else {
        await new Promise((resolve) => setTimeout(resolve, 200));
        job.result = { processed: true };
      }

      job.status = 'COMPLETED';
      job.progress = 100;
      job.completedAt = new Date().toISOString();
    } catch (err: any) {
      job.status = 'FAILED';
      job.error = err?.message || 'Job processing failed';
    }
  }

  public getJobs(): QueueJob[] {
    return this.jobs;
  }
}

export const backgroundQueue = new BackgroundQueue();
