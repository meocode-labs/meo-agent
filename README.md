# meo-agent

> **A minimal, dependency-free wget clone for the modern terminal.**
> Download files via HTTP/HTTPS — install once, run anywhere as a single static binary.

[![Latest Release](https://img.shields.io/github/v/release/meocode-labs/meo-agent)](https://github.com/meocode-labs/meo-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A518-green)](https://nodejs.org)

`meo-agent` is a lightweight command-line tool that fetches any file from the web straight to your local disk. It is built with Node.js core modules only and packaged as a standalone executable — no runtime required on the target machine.

---

## Table of Contents

- [Why meo-agent?](#why-meo-agent)
- [Features](#features)
- [Installation](#installation)
  - [End Users (recommended)](#end-users-recommended)
  - [Developers (from source)](#developers-from-source)
- [Usage](#usage)
- [Examples](#examples)
- [Build from Source](#build-from-source)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Why meo-agent?

Most "wget clones" either:

- Pull in hundreds of dependencies
- Require Node.js on every target machine
- Ship bloated runtimes just to download a file

`meo-agent` takes the opposite approach:

- **Zero external dependencies** — only Node.js built-in modules (`fs`, `http`, `https`)
- **Single static binary** — packaged with [`@yao-pkg/pkg`](https://github.com/yao-pkg/pkg)
- **Predictable behavior** — same semantics on Windows, macOS, and Linux
- **Minimal footprint** — roughly 80 MB binary, instant startup

---

## Features

| Feature | Description |
|---------|-------------|
| HTTP & HTTPS | Download from both protocols seamlessly |
| Auto filename detection | Uses the last path segment of the URL, falls back to `index.html` |
| Streaming writes | Files are written via stream pipe — no full buffering in memory |
| Cross-platform | Prebuilt binaries for Windows, macOS, and Linux |
| Zero runtime deps | Static binary needs no Node.js installation on target |
| Auto-release | GitHub Actions builds & publishes on every push to `master`/`main` |

---

## Installation

### End Users (recommended)

Download the prebuilt binary for your platform from the [**Releases**](../../releases) page.

#### Windows

1. Download `meo-agent-win.exe` from the latest release
2. Rename to `meo-agent.exe` (optional) and place it anywhere in your `PATH`
3. Open Command Prompt / PowerShell and run:

```powershell
meo-agent.exe https://example.com/file.zip
```

#### macOS

```bash
# Download meo-agent-macos from latest release, then:
chmod +x meo-agent-macos
mv meo-agent-macos /usr/local/bin/meo-agent   # optional, for global access
./meo-agent-macos https://example.com/file.zip
```

#### Linux

```bash
# Download meo-agent-linux from latest release, then:
chmod +x meo-agent-linux
./meo-agent-linux https://example.com/file.zip
```

#### via npm (cross-platform)

```bash
npm install -g meo-agent
meo-agent https://example.com/file.zip
```

> Requires Node.js ≥ 18 on the target machine.

---

### Developers (from source)

Clone and link the package locally so it works as a global command on your machine:

```bash
git clone https://github.com/meocode-labs/meo-agent.git
cd meo-agent
npm install
npm link
```

After linking, `meo-agent` is available system-wide:

```bash
meo-agent https://example.com/file.zip
```

To remove the global link later:

```bash
npm unlink -g meo-agent
```

---

## Usage

```
meo-agent <URL>
```

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `URL`    | Yes      | Full HTTP or HTTPS URL of the file to download |

### Exit codes

| Code | Meaning |
|------|---------|
| `0`  | Download completed successfully |
| `1`  | Missing URL argument |
| `1`  | Network error or invalid URL |

---

## Examples

```bash
# Download a zip archive
meo-agent https://github.com/meocode-labs/meo-agent/archive/refs/heads/main.zip

# Download from an HTTPS CDN
meo-agent https://cdn.example.com/image.png

# Download a JSON API snapshot
meo-agent https://api.example.com/v1/export.json

# Falls back to index.html if URL has no path
meo-agent https://example.com/
```

The file is saved to the **current working directory** using the last segment of the URL as the filename. If the URL ends with `/`, the file is named `index.html`.

---

## Build from Source

To produce the binaries yourself (requires Node.js 18+):

```bash
git clone https://github.com/meocode-labs/meo-agent.git
cd meo-agent
npm install
npm run build
```

Output files inside `dist/`:

```
dist/meo-agent-win.exe
dist/meo-agent-macos
dist/meo-agent-linux
```

To bump the version:

1. Edit `package.json` → `"version": "1.0.2"`
2. Commit and push to `main` — GitHub Actions auto-creates release `v1.0.2`

---

## How It Works

1. CLI entry point: `index.js` (top-level shebang `#!/usr/bin/env node`)
2. Reads URL from `process.argv[2]`
3. Picks `https` or `http` module based on URL scheme
4. Pipes response stream directly to a `fs.createWriteStream`
5. Closes write stream on `finish` event → prints confirmation

The full source is ~25 lines. Read it here: [`index.js`](index.js).

Packaging is handled by `@yao-pkg/pkg`, which embeds the Node.js runtime into a single executable — no separate Node install needed on the target machine.

---

## Project Structure

```
meo-agent/
├── .github/workflows/release.yml   # Auto-build & release on push to main
├── index.js                        # CLI source (~25 lines)
├── package.json                    # Metadata, bin entry, pkg targets
├── README.md
├── LICENSE
├── CHANGELOG.md
└── .npmignore
```

---

## Contributing

Contributions are welcome. For substantial changes, please open an issue first to discuss the proposed change.

```bash
# Fork & clone
git clone https://github.com/YOUR-USERNAME/meo-agent.git
cd meo-agent
npm install
npm link

# Develop, then:
npm run build    # test binary output
```

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance / tooling
- `docs:` — documentation only
- `refactor:` — code change with no behavior change

---

## Roadmap

- [ ] Progress bar for large downloads
- [ ] Resume support (`--continue`)
- [ ] Custom output filename (`--output <name>`)
- [ ] Mirror mode (recursive)
- [ ] Checksum verification (`--sha256`)

---

## License

[MIT](LICENSE) © 2026 [meocode-labs](https://github.com/meocode-labs) & contributors