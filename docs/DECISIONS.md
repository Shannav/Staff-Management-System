# Decisions

## Phase 1

- Keep the requested monorepo layout and provide the database and Redis through
  Compose from the first phase.
- The scaffold's worker is an idle process, not a camera processor. Camera
  sources, event consumers, and persisted analytics are intentionally deferred
  to their named phases.
- Authentication uses a JWT bearer token and a single environment-configured
  bootstrap administrator until persistent users and RBAC management arrive
  with the database phase. The UI holds tokens in memory rather than browser
  storage.
- Development mode creates a random process-local signing key only when no key
  is configured. Production mode refuses to start without an explicit key.
- The dashboard labels all initial metrics as sample data; it does not imply
  that any camera analytics are already running.
- TimescaleDB is used as the PostgreSQL-compatible Compose image; schema and
  hypertable migrations are deferred to Phase 2.
