'use strict';

function parseArgs(argv) {
    const opts = {
        url: null,
        output: null,
        continue: false,
        json: false,
        quiet: false,
        timeout: null,
        help: false,
        version: false,
        sha256: null,
        mirror: false,
        mirrorDepth: null,
        mirrorLimit: null,
        config: null,
        pluginList: false
    };

    const positional = [];
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        switch (a) {
            case '-h':
            case '--help':
                opts.help = true;
                break;
            case '-V':
            case '--version':
                opts.version = true;
                break;
            case '-o':
            case '--output':
                opts.output = argv[++i];
                break;
            case '-c':
            case '--continue':
                opts.continue = true;
                break;
            case '-j':
            case '--json':
                opts.json = true;
                break;
            case '-q':
            case '--quiet':
                opts.quiet = true;
                break;
            case '-m':
            case '--mirror':
                opts.mirror = true;
                break;
            case '--sha256':
                opts.sha256 = argv[++i];
                break;
            case '--mirror-depth':
                opts.mirrorDepth = parseInt(argv[++i], 10);
                break;
            case '--mirror-limit':
                opts.mirrorLimit = parseInt(argv[++i], 10);
                break;
            case '--config':
                opts.config = argv[++i];
                break;
            case '--list-plugins':
                opts.pluginList = true;
                break;
            case '--timeout':
                opts.timeout = parseInt(argv[++i], 10);
                break;
            default:
                positional.push(a);
        }
    }

    if (positional.length > 0 && !opts.url) {
        opts.url = positional[0];
    }

    return opts;
}

function printHelp() {
    const help = `
meo-agent — wget-like CLI for downloading files (Meo Code Labs)

Usage:
  meo-agent [options] <URL>
  meo-agent [options] doctor
  meo-agent [options] mirror <URL> -o <dir>
  meo-agent [options] plugins

Options:
  -o, --output <name>      Save to a custom filename or directory (for mirror)
  -c, --continue           Resume a partial download via HTTP Range
  -m, --mirror             Recursive mirror mode (downloads HTML pages + assets)
      --mirror-depth <N>   Max recursion depth (default: 2)
      --mirror-limit <N>   Max total pages to download (default: 50)
      --sha256 <hash>      Verify downloaded file SHA256
  -j, --json               Emit machine-readable JSON events to stdout
  -q, --quiet              Suppress progress output (errors only)
      --timeout <sec>      Network timeout in seconds (default: 30)
      --config <path>      Load config from custom path
      --list-plugins       List loaded plugins and exit
  -V, --version            Print version and exit
  -h, --help               Print this help and exit

Config file lookup order:
  1. --config <path>        (explicit override)
  2. ./.meo-agent.json      (current directory)
  3. ~/.meo-agent.json      (home directory)
  4. ~/.config/meo-agent/config.json (XDG)

Plugin directories (auto-loaded):
  - ./.meo-agent/plugins/
  - ~/.meo-agent/plugins/
  - ~/.config/meo-agent/plugins/

Examples:
  meo-agent https://example.com/file.zip
  meo-agent -o backup.zip https://example.com/file.zip
  meo-agent --sha256=abc123... https://example.com/file.zip
  meo-agent --continue https://example.com/large.iso
  meo-agent --mirror https://docs.example.com/ -o ./docs
  meo-agent --json https://example.com/file.zip | jq
  meo-agent doctor
  meo-agent plugins

Repository: https://github.com/meocode-labs/meo-agent
`.trim();
    console.log(help);
}

module.exports = { parseArgs, printHelp };