# meo-agent

A simple `wget` clone built with Node.js. Download any file via URL from the terminal.

## For Developers (Local Install)

Clone the repository and link it globally so you can run `meo-agent` as a terminal command:

```bash
git clone https://github.com/penadidik/meo-agent.git
cd meo-agent
npm install
npm link
```

After linking, use it anywhere:

```bash
meo-agent https://example.com/file.zip
```

To uninstall the global link:

```bash
npm unlink -g meo-agent
```

## For End Users (No Node.js Required)

Download the prebuilt binary from the [Releases](../../releases) page:

- **Windows**: download `meo-agent-win.exe` from the latest release and run from Command Prompt or PowerShell.
- **macOS**: download `meo-agent-macos`, make it executable, and run:

```bash
chmod +x meo-agent-macos
./meo-agent-macos https://example.com/file.zip
```

No Node.js or npm install needed.

## Build Locally

To produce the binaries yourself:

```bash
npm install
npm install -g @yao-pkg/pkg
npm run build
```

This generates `meo-agent-win.exe` and `meo-agent-macos` inside the `dist/` folder.

## License

MIT