export interface HealthCheckOutput {
  status: 'UP' | 'DOWN';
  database: 'UP' | 'DOWN';
  uptime: number;
  timestamp: string;
  latency: string;
}
