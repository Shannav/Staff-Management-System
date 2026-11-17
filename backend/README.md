# Backend

Install the package and development tools with `python -m pip install -e
".[dev]"`, then run `uvicorn retailvision.api.main:app --reload --app-dir src`.
Set `APP_SECRET_KEY`, `BOOTSTRAP_ADMIN_EMAIL`, and
`BOOTSTRAP_ADMIN_PASSWORD` in the environment to enable token login. Database
models and migrations are intentionally introduced in Phase 2.
