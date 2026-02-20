/** Output of the system health check operation. */
export interface HealthCheckOutput {
  /** Overall application status. */
  status: 'UP' | 'DOWN';
  /** Database connection status. */
  database: 'UP' | 'DOWN';
  /** Total server uptime in seconds. */
  uptime: number;
  /** Current server timestamp in ISO format. */
  timestamp: string;
  /** Current server latency in milliseconds. */
  latency: string;
}
