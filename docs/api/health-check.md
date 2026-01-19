# Health check

## `GET` API health status

Verifies the operational status of the API service and its connection to the primary persistence layer (Database).

### **Endpoint**

```
/api/health
```

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/health"
```

### **Response Body**

| Name      | Type           | Description                            |
| :-------- | :------------- | :------------------------------------- |
| status    | string \| null | General Service status.                |
| database  | string \| null | Database status.                       |
| uptime    | number \| null | System uptime in seconds.              |
| latency   | string \| null | Database connection latency.           |
| timestamp | string \| null | Date and time (ISO 8601) of the check. |

**_Example:_**

```json
{
  "status": "UP",
  "database": "UP",
  "uptime": 1542.45,
  "latency": "12ms",
  "timestamp": "2026-01-17T12:00:00.000Z"
}
```
