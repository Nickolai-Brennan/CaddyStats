## 2026-05-14 — Documentation foundation

- Added: canonical core, product, governance, architecture, and strategy documentation under `docs/`
- Changed: root `README.md` now points to the canonical documentation map instead of acting as a build-system spec
- Fixed: documentation entry points now distinguish canonical `docs/` content from legacy `Support/docs/` source material
- Plugins:
- Commands:
- Notes: `make lint` and `make test` were run before and after the edit window; both currently fail in this environment because `ruff` and `pytest` are unavailable
