# Troubleshooting

## Common Issues

### `Can't reach database server at 127.0.0.1:5432`

- **Location**: Database
- **Reason**: The application cannot connect to the PostgreSQL instance. This usually happens because the Docker container is stopped or the database hasn't finished its initialization.
- **Solution**:
  1. Check if the Docker container is running: `docker compose ps`.
  2. If it's stopped, start it: `docker-compose up -d`.
  3. Verify the `DATABASE_URL` in your `.env` file matches the Docker settings (port 5432 is the default).
  4. Wait a few seconds after starting Docker for the database to be ready before running commands like `prisma:migrate` or starting the dev server.

### `Hydration Mismatch` or `Text content did not match server-rendered HTML`

- **Location**: Frontend
- **Reason**: This happens in Next.js when the server-rendered HTML doesn't match the first client-side render. It's common when using client-only APIs (like `localStorage` or `window`) or theme preferences immediately on render.
- **Solution**: Use a `mounted` state to ensure client-specific code only renders after hydration.

  ```tsx
  // 1. Initialize state as false
  const [mounted, setMounted] = useState(false);

  // 2. Set to true only after mount
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // 3. Conditional rendering
  if (!mounted) return <Placeholder />;

  return <YourClientOnlyComponent />;
  ```
