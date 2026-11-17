# Privacy and camera deployment

This scaffold does not ingest camera feeds, identify people, or retain camera
images. Before enabling those capabilities:

- Complete a privacy impact assessment and obtain legal advice for the
  deployment jurisdiction, including Sri Lanka PDPA No. 9 of 2022 where
  applicable.
- Provide clear camera signage and a documented purpose, retention period,
  access policy, and contact for questions.
- Do not identify customers or store their face images. Keep customer reporting
  to anonymous aggregate counts.
- Keep any staff face recognition disabled until each enrolled staff member has
  given documented, revocable opt-in consent. Encrypt embeddings and minimize
  retention.
- Use HR records—not camera inference—for staff gender. Never rank or penalize
  individuals by gender; only show sufficiently aggregated fairness analysis.
- Keep customer demographic estimation disabled by default; if enabled later,
  use anonymous aggregates, a visible accuracy disclaimer, and no per-person
  persistence.
- Replace all development credentials, configure TLS and backups, and restrict
  network access before production use.

## Signage template

> CCTV analytics are in use at this location for [specific operational
> purposes]. Customer identities and face images are not collected. For
> information about this processing, retention, or your rights, contact
> [organization/contact].

Have the final notice reviewed for local legal requirements and adapt it to the
actual analytics before posting.
