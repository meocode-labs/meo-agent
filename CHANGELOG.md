# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- README rewritten to position `meo-agent` as the unified AI agent runtime from Meo Code Labs
- Documentation now covers all bundled tools: `meo-agent` CLI, `developer-kit`, and `generate-pr`
- Package metadata updated: author `penadidik` (researcher@meocode.com), contributor Meo Code Labs
- Repository description: "AI agent runtime distributed by [Meo Code Labs](https://meocode.com)"

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

[Unreleased]: https://github.com/meocode-labs/meo-agent/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/meocode-labs/meo-agent/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/meocode-labs/meo-agent/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/meocode-labs/meo-agent/releases/tag/v1.0.0