# meo-agent

> **The AI agent runtime from Meo Code Labs — a unified CLI for downloading files, scaffolding use cases, and auto-generating pull requests.**
>
> Built for developers, researchers, and AI-augmented workflows.

[![Latest Release](https://img.shields.io/github/v/release/meocode-labs/meo-agent)](https://github.com/meocode-labs/meo-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A518-green)](https://nodejs.org)
[![Meo Code Labs](https://img.shields.io/badge/Meo%20Code%20Labs-meocode.com-blue)](https://meocode.com)

`meo-agent` is a lightweight, **multi-tool AI agent runtime** distributed by [Meo Code Labs](https://meocode.com). It is designed to be a single, well-maintained entry point that bundles several developer utilities used across AI-assisted workflows:

| Tool | Purpose |
|------|---------|
| **meo-agent** (this repo) | Wget-like CLI — download any file via HTTP/HTTPS as a single static binary |
| **developer-kit** | Auto-scaffold `usecase-NNN/` folders (`requirements.md`, `tasks.md`, `tdd.md`) from a brief |
| **generate-pr** | Auto-generate pull request descriptions from git diffs (`basic`, `lead`, `hod` review levels) |

> These companion tools live as modules inside this repository (`developer-kit/`, `pull_request/`) and are also exposed as opencode slash commands (`/developer-kit`, `/generate-pr`).

---

## Table of Contents

- [About Meo Code Labs](#about-meo-code-labs)
- [Why meo-agent?](#why-meo-agent)
- [Tools Bundled](#tools-bundled)
  - [1. meo-agent (CLI)](#1-meo-agent-cli)
  - [2. developer-kit](#2-developer-kit)
  - [3. generate-pr](#3-generate-pr)
- [Installation](#installation)
- [Usage by Tool](#usage-by-tool)
- [Build from Source](#build-from-source)
- [Project Structure](#project-structure)
- [Maintainers](#maintainers)
- [License](#license)

---

## About Meo Code Labs

[Meo Code Labs](https://meocode.com) is a research-driven software organization focused on **AI-augmented developer tooling**. We build small, dependable utilities that fit naturally into the workflow of engineers and AI agents alike.

- 🌐 Website: [https://meocode.com](https://meocode.com)
- 🧑‍💻 Lead Maintainer: [@penadidik](https://github.com/penadidik)
- 🏢 Organization: [github.com/meocode-labs](https://github.com/meocode-labs)
- 📦 Repositories: [github.com/meocode-labs](https://github.com/meocode-labs)

If you use our tools in research or production, we'd love to hear from you.

---

## Why meo-agent?

Most developer utilities either:

- Are buried inside monolith frameworks
- Require Node.js on every target machine
- Have inconsistent semantics across platforms
- Don't ship as static binaries

`meo-agent` from Meo Code Labs takes a different approach:

- **Zero external runtime** — packaged as a single static binary
- **Predictable behavior** — same semantics on Windows, macOS, and Linux
- **Bundled toolchain** — multiple agents in one repository
- **Opencode-native** — slash-command integration out of the box
- **Research-grade** — designed to be auditable, minimal, and scriptable by AI agents

---

## Tools Bundled

### 1. meo-agent (CLI)

The flagship tool: a wget clone built from Node.js core modules only.

```bash
meo-agent https://example.com/file.zip
```

Features:

- HTTP & HTTPS support
- Auto-detected output filename from URL path (`-o` to override)
- Streaming writes — no full buffering in memory
- Progress bar to stderr
- Resume interrupted downloads (`-c` / `--continue`)
- JSON output mode (`--json`) for AI agent consumption
- Environment diagnostics (`meo-agent doctor`)
- Cross-platform static binary (no Node.js install required on target)

**Source:** [`index.js`](index.js) · **Packaging:** [`@yao-pkg/pkg`](https://github.com/yao-pkg/pkg)

---

### 2. developer-kit

> *Scaffold a complete use case from a single brief.*

Located in [`developer-kit/`](developer-kit/). Generates a folder `usecase-NNN/` containing three structured documents from a one-sentence brief:

| File | Contents |
|------|----------|
| `requirements.md` | Functional & non-functional requirements, acceptance criteria, assumptions, constraints |
| `tasks.md` | 5-phase task breakdown (Discovery, Design, Implementation, Quality, Release) |
| `tdd.md` | Test matrix, edge cases, performance tests, security tests, CI/CD integration |

**Usage:**

```bash
S=~/Developer/meocode/meo-agent/developer-kit/developer-kit.sh
"$S" ./docs "Add login with OAuth2"
```

Counter logic auto-detects `usecase-NNN` directories and increments to the next available number. Supports explicit numbering, custom paths, and interactive TUI prompts.

Full docs: [`developer-kit/README.md`](developer-kit/README.md)

---

### 3. generate-pr

> *Auto-generate a pull request description from your git diff — at the review depth you need.*

Located in [`pull_request/`](pull_request/). Two-phase workflow:

1. **Metadata phase** (script) — auto-fills repo, branch, file list, diff stat, and commits
2. **Analysis phase** (AI / manual) — fills in `<!-- REVIEW:* -->` placeholders for `lead` / `hod` review levels

**Usage:**

```bash
S=~/Developer/meocode/meo-agent/pull_request/generate-pr.sh

# Basic PR description (default)
"$S"

# Lead-level review
"$S" lead improvements/pickup-report/08062026

# HOD-level review with PR number
"$S" hod request/SCA-Ticketing/17062026 515
```

Outputs to `pull_request/output/<app_name>/pull_request_<datetime>.md` with auto-suffix to prevent overwrites.

Full docs: [`pull_request/README.md`](pull_request/README.md)

---

## Installation

### End Users — Prebuilt Binary (recommended)

Download the prebuilt binary from the [**Releases**](../../releases) page.

#### Windows

```powershell
# Download meo-agent-win.exe from latest release, then in PowerShell:
.\meo-agent-win.exe https://example.com/file.zip
```

#### macOS

```bash
chmod +x meo-agent-macos
./meo-agent-macos https://example.com/file.zip
```

#### Linux

```bash
chmod +x meo-agent-linux
./meo-agent-linux https://example.com/file.zip
```

#### via npm

```bash
npm install -g @meocode-labs/meo-agent
meo-agent https://example.com/file.zip
```

> Requires Node.js ≥ 18 on the target machine.

---

### Developers — From Source

```bash
git clone https://github.com/meocode-labs/meo-agent.git
cd meo-agent
npm install
npm link           # install meo-agent as a global command
```

After linking, the CLI is available system-wide:

```bash
meo-agent https://example.com/file.zip
```

For the companion tools (`developer-kit`, `generate-pr`), invoke directly from source:

```bash
./developer-kit/developer-kit.sh ./docs "Add login with OAuth2"
./pull_request/generate-pr.sh
```

For opencode integration, symlink the commands:

```bash
mkdir -p ~/.config/opencode/command
ln -s $(pwd)/.opencode/developer-kit.md ~/.config/opencode/command/developer-kit.md
ln -s $(pwd)/.opencode/generate-pr.md   ~/.config/opencode/command/generate-pr.md
```

Then restart opencode and use `/developer-kit`, `/generate-pr` inside your AI session.

To uninstall:

```bash
npm unlink -g meo-agent
```

---

## Usage by Tool

### meo-agent CLI

```
meo-agent [options] <URL>
meo-agent [options] doctor
```

**Options:**

| Flag | Description |
|------|-------------|
| `-o, --output <name>` | Save to a custom filename (default: URL basename) |
| `-c, --continue` | Resume a partial download if server supports `Range` |
| `-j, --json` | Emit machine-readable JSON events to stdout (for AI agents) |
| `-q, --quiet` | Suppress progress output, only print errors |
| `--timeout <sec>` | Network timeout in seconds (default: 30) |
| `-V, --version` | Print version and exit |
| `-h, --help` | Print help and exit |

**Examples:**

```bash
# Basic download
meo-agent https://github.com/meocode-labs/meo-agent/archive/refs/heads/main.zip

# Custom output filename
meo-agent -o backup.zip https://example.com/file.zip

# Resume an interrupted download
meo-agent --continue https://example.com/large-file.iso

# JSON output for AI agents (pipe to jq)
meo-agent --json https://example.com/data.json | jq

# Quiet mode (errors only)
meo-agent --quiet https://example.com/file.zip

# Environment diagnostics
meo-agent doctor
```

**JSON event schema** (emitted one per line when `--json` is set):

```json
{"event":"start","url":"...","output":"...","ts":1700000000000}
{"event":"progress","received":1024,"total":2048,"percent":50,"ts":...}
{"event":"finish","output":"...","bytes":2048,"elapsed_sec":1.23,"status":200,"resumed":false}
{"event":"error","message":"...","code":"...","ts":...}
```

### developer-kit

```bash
developer-kit <docs_dir> "<brief>" [usecase_number]
```

| Argument | Required | Description |
|----------|----------|-------------|
| `docs_dir`        | Yes | Target directory (auto-created if missing) |
| `brief`           | Yes | One-sentence use case description |
| `usecase_number`  | No  | Explicit 3-digit number (auto-incremented if omitted) |

### generate-pr

```bash
generate-pr [type] [branch] [pr_number]
```

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| `type`        | No  | `basic` | `basic` \| `lead` \| `hod` |
| `branch`      | No  | current | Target branch |
| `pr_number`   | No  | `TBD`   | PR number for URL |

---

## Build from Source

To produce the static binaries yourself (requires Node.js 18+):

```bash
git clone https://github.com/meocode-labs/meo-agent.git
cd meo-agent
npm install
npm run build
```

Output inside `dist/`:

```
dist/meo-agent-win.exe
dist/meo-agent-macos
dist/meo-agent-linux
```

To release a new version:

1. Bump `package.json` → `"version": "1.0.3"`
2. Commit and push to `main`
3. GitHub Actions auto-creates `v1.0.3` with binaries and full release notes

---

## Project Structure

```
meo-agent/
├── .github/workflows/release.yml   # Auto-build & release on push to main
├── developer-kit/                  # Use case scaffolder (bash + templates)
│   ├── developer-kit.sh
│   └── templates/{requirements,tasks,tdd}.md
├── pull_request/                   # PR description generator (bash + templates)
│   ├── generate-pr.sh
│   └── templates/{basic,lead-review,hod-review}.md
├── index.js                        # meo-agent CLI source
├── package.json
├── README.md
├── CHANGELOG.md
├── LICENSE
└── .npmignore
```

---

## Maintainers

| Role | Maintainer |
|------|------------|
| Lead Maintainer & Researcher | [@penadidik](https://github.com/penadidik) |
| Organization | [Meo Code Labs](https://github.com/meocode-labs) |
| Website | [https://meocode.com](https://meocode.com) |

---

## Contributing

We welcome pull requests, bug reports, and feature proposals. For substantial changes, please open an issue first.

```bash
git clone https://github.com/YOUR-USERNAME/meo-agent.git
cd meo-agent
npm install
npm link
npm run build
```

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance / tooling
- `docs:` — documentation only
- `refactor:` — code change with no behavior change

---

## Roadmap

- [x] Progress bar for large downloads (`meo-agent`) — **shipped in 1.1.0**
- [x] Resume support (`--continue`) — **shipped in 1.1.0**
- [x] Custom output filename (`--output <name>`) — **shipped in 1.1.0**
- [x] JSON output mode for AI agents (`--json`) — **shipped in 1.1.0**
- [x] `meo-agent doctor` — environment diagnostics — **shipped in 1.1.0**
- [ ] Plugin architecture for additional developer tools
- [ ] Checksum verification (`--sha256`)
- [ ] Mirror mode (recursive)
- [ ] Config file (`~/.meo-agent.json`)
- [ ] Auth via headers (`--header "Authorization: Bearer ..."`)

---

## License

[MIT](LICENSE) © 2026 [Meo Code Labs](https://meocode.com). Maintained by [@penadidik](https://github.com/penadidik).

> *"Small tools, well made, used often."* — Meo Code Labs