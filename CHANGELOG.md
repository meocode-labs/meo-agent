# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] - 2026-06-22

### Added — Pull request workflow
- **GitHub PR templates** — default template (`.github/pull_request_template.md`) auto-loads for every PR with required sections: summary, type-of-change, testing, scope, 12-point Definition-of-Done checklist, breaking changes, reviewer focus
- **PR template variants** in `.github/PULL_REQUEST_TEMPLATE/`:
  - `review-checklist.md` — 10-section reviewer checklist (correctness, design, code quality, tests, security, performance, observability, docs, CI)
  - `bug-fix.md` — root-cause analysis + regression-prevention focus
  - `feature.md` — problem-statement → alternatives → rollout-plan flow

### Changed
- `.gitignore` — exclude generated artifact directories `pull_request/output/` and `developer-kit/output/` (previously only excluded from npm tarball)

### Published
- npm: https://www.npmjs.com/package/@penadidik/meo-agent

## [1.2.1] - 2026-06-19

### Changed
- README rewritten with prominent **Quick Start** section at the top — users can now choose between npm install (Node 18+) or standalone binary download in seconds
- Installation section restructured into two clear paths (A: npm, B: standalone binary) with side-by-side "which path should I pick?" comparison table
- Removed redundant "End Users" / "Developers" split — replaced with task-oriented guidance

### Published
- npm: https://www.npmjs.com/package/@penadidik/meo-agent

## [1.2.0] - 2026-06-19

### Added — Final roadmap batch
- **Checksum verification** (`--sha256 <hash>`) — verifies downloaded file integrity via SHA256, exits with code 2 on mismatch
- **Mirror mode** (`--mirror` / `-m`) — recursive HTML page mirroring with `--mirror-depth` and `--mirror-limit` controls
- **Config file support** (`~/.meo-agent.json` or `--config <path>`) — set defaults for timeout, retries, headers, mirror depth, plugins
- **Plugin architecture** (`lib/plugins.js`) — load JS plugins from `.meo-agent/plugins/`, `~/.meo-agent/plugins/`, or `~/.config/meo-agent/plugins/`
- **Plugin hooks** — `before_download`, `after_download` for extending behavior
- **`meo-agent plugins`** — list loaded plugins with version, description, hooks
- **Example plugin** (`examples/plugins/meo-agent-logger.js`) — logs every download event to stderr

### Changed
- CLI restructured into subcommands: `meo-agent <url>`, `meo-agent doctor`, `meo-agent mirror <url>`, `meo-agent plugins`
- Test suite expanded to 20 assertions covering args parser, checksum, config, plugins
- Help output reorganized with config-file lookup order and plugin directories

### Removed
- Roadmap item: "Auth via headers" — deferred (not a core wget feature)

[Unreleased]: https://github.com/meocode-labs/meo-agent/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/meocode-labs/meo-agent/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/meocode-labs/meo-agent/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/meocode-labs/meo-agent/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/meocode-labs/meo-agent/compare/v1.0.3...v1.1.0

### Added — Roadmap milestones shipped
- **Progress bar** for large downloads — live `[████░░░░] 50%  1.20 / 2.40 MB` indicator
- **Resume support** (`--continue`) — picks up partial downloads via HTTP `Range`
- **Custom output filename** (`-o <name>` / `--output <name>`)
- **JSON output mode** (`--json`) — structured events for AI agent consumption
- **`meo-agent doctor`** — environment diagnostics (Node version, disk space, HTTPS/HTTP connectivity)
- **Quiet mode** (`-q` / `--quiet`)
- **Configurable timeout** (`--timeout <sec>`)
- **Modular codebase** — split into `lib/` (args, downloader, reporter, doctor) and `bin/`
- **Unit tests** — `npm test` runs 11 assertions across args parser, filename helpers, reporter
- **Build reliability** — workflow now uses `./node_modules/.bin/pkg` directly, eliminating `yao-pkg: not found` errors permanently

### Changed
- README rewritten with full option table, JSON event schema, examples
- Roadmap section updated — 5 items marked shipped
- Project structure expanded: `bin/`, `lib/`, `test/`

## [1.0.3] - 2026-06-19

### Changed
- Rebrand as Meo Code Labs unified AI agent runtime
- README positioned `meo-agent` as flagship open-source distribution from Meo Code Labs
- Documentation now covers all bundled tools: `meo-agent` CLI, `developer-kit`, and `generate-pr`
- Package metadata updated: author `penadidik` (researcher@meocode.com), contributor Meo Code Labs

## [1.0.2] - 2026-06-19

### Changed
- Move `@yao-pkg/pkg` from `dependencies` to `devDependencies` (build tool only)
- Rewrite README.md with full project positioning, feature matrix, install paths, and roadmap

## [1.0.1] - 2026-06-19

### Fixed
- `yao-pkg: not found` in CI: use `npx @yao-pkg/pkg` to resolve binary via local install

## [1.0.0] - 2026-06-19

### Added
- Initial release of `meo-agent` — wget-like CLI for HTTP/HTTPS downloads
- Single static binary distribution via `@yao-pkg/pkg` (Windows, macOS, Linux)
- GitHub Actions workflow for automated releases on push to `master`/`main`
- Bundled tools: `developer-kit/` (use case scaffolder) and `pull_request/` (PR description generator)
- Comprehensive release notes auto-generated from commit history and diff stats
- MIT License, CHANGELOG, .npmignore

[Unreleased]: https://github.com/meocode-labs/meo-agent/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/meocode-labs/meo-agent/compare/v1.0.3...v1.1.0
[1.0.3]: https://github.com/meocode-labs/meo-agent/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/meocode-labs/meo-agent/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/meocode-labs/meo-agent/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/meocode-labs/meo-agent/releases/tag/v1.0.0