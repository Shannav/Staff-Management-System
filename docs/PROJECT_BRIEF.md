# RetailVision BI — Project Brief

## Product

Build a production-grade business intelligence platform for Quick Service
Restaurants (QSR) and retail stores that turns camera feeds into operational
analytics.

## Business goals

- **Footfall:** count entries and exits, current occupancy, peak hours, dwell
  time, conversion (footfall vs. POS transactions), queue length, and wait time.
- **Staff attendance:** detect staff arrival/departure, compute hours, and
  compare late arrivals, early exits, and absences with the roster.
- **Staff productivity:** compute active/idle time by counter, kitchen, and floor
  zones; serving events; customers served per staff-hour; zone coverage; and
  shift comparisons.
- **Products:** count shelf items, trays, packed orders, or items passing a
  handoff line; alert on low stock and empty shelves.
- **Gender reporting:** aggregated analytics only, under the privacy rules below.
- Provide BI dashboards with KPIs, drill-down, filters, date ranges,
  comparisons, and export.

## Camera input

Support CCTV/IP cameras using RTSP/ONVIF, mobile phone cameras using RTSP apps
or browser WebRTC, USB webcams, and uploaded video files for testing. Abstract
sources behind `CameraSource`; run one worker process per camera; support
reconnect, frame skipping, FPS throttling, and per-camera health. Provide camera
configuration, connection testing, snapshots, and normalized zones/lines for
entrances, counters, kitchens, shelves, and queues.

## Technology

- **Backend/CV:** Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2, Alembic,
  WebSockets, OpenCV, Ultralytics YOLO, ByteTrack/BoT-SORT, opt-in staff-only
  InsightFace/ArcFace (or face_recognition), MediaPipe or YOLO-pose, Redis,
  Celery or APScheduler, PostgreSQL with TimescaleDB, MinIO/local object
  storage, pytest, Ruff, mypy, pre-commit, and structlog.
- **Frontend:** React 18, Vite, TypeScript, TailwindCSS, shadcn/ui, Framer
  Motion, Apache ECharts or Recharts, TanStack Table/Query, Zustand, React
  Router, dark/light themes, responsive accessible design, and English/Sinhala/
  Tamil readiness.
- **Operations:** Docker Compose for API, worker, database, Redis, and frontend;
  `.env` configuration; GitHub Actions CI; optional NVIDIA GPU with CPU
  fallback.

## Architecture

Use a monorepo with `/backend` (API, vision workers, services, models, schemas,
tests), `/frontend`, `/infra`, `/docs`, and `/scripts`. Vision workers emit
events (`person_in`, `person_out`, `staff_seen`, `product_count`, `zone_enter`,
`zone_exit`, `idle_start`) through Redis. The API persists events and pushes
live updates over WebSockets. Jobs create hourly/daily rollups. Use clean
architecture, dependency injection, configurable thresholds, and no
hard-coded secrets. Model weights are configurable and have a download script.

## Minimum data model

Stores, cameras, zones, staff (`employee_no`, name, role, HR-provided gender,
shift, encrypted face embedding, consent timestamp), rosters/shifts,
attendance records, presence events, footfall events and hourly rollups,
product catalog/counts, productivity metrics, alerts, users, roles, and audit
log.

## Privacy, security, and compliance (non-negotiable)

- Design for Sri Lanka PDPA No. 9 of 2022 and GDPR-style principles; obtain
  appropriate legal review before deployment.
- Staff face recognition is opt-in with recorded consent. Encrypt embeddings;
  never keep raw face images unless explicitly enabled. Provide retention and
  purge controls.
- Never identify customers or store customer faces. Keep customer analytics to
  anonymous counts.
- Staff gender comes only from HR-provided data. Optional customer demographic
  estimates must be anonymous, aggregated, feature-flagged, and carry a visible
  accuracy disclaimer; do not persist person-level estimates.
- Gender-based productivity reporting is aggregated for fairness auditing, not
  for individual ranking or penalties. Show a fairness note in the UI.
- Provide JWT authentication, Admin/Manager/Viewer RBAC, audit logs, rate
  limiting, HTTPS-ready configuration, input validation, and signage/consent
  templates.

## User experience

Use a BI-style sidebar, global store/camera/date/shift filters, KPI cards with
sparklines, soft shadows, animations, responsive layouts, and consistent theme
tokens/chart colors. Pages: Executive Overview, Live Monitor, Footfall
Analytics, Staff Attendance, Staff Productivity, Product Tracking, Camera &
Zone Management, Staff Management, Reports, Alerts, Settings, and Audit Log.
Include loading/empty/error states, toast notifications, keyboard shortcuts,
accessible interactions, and i18n readiness.

## Quality bar

Type hints, docstrings, tests for line crossing, zone dwell, and attendance
rules; API integration tests; mock camera; realistic 60-day demo seed data;
setup and camera guides; troubleshooting; and performance tuning. Target four
cameras at 10–15 FPS on a mid-range GPU or 8-core CPU with frame skipping.

## Delivery sequence

1. Scaffold and infrastructure.
2. Database, CRUD APIs, and demo seed data.
3. Camera abstraction and management.
4. Footfall, occupancy, and rollups.
5. Consent-based staff attendance.
6. Staff productivity.
7. Product counting.
8. BI dashboards and reporting polish.
9. Hardening, deployment, privacy templates, and final documentation.

Complete and verify one phase at a time; document decisions and known limits.
