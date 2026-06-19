'use strict';

function parseArgs(argv) {
    const opts = {
        url: null,
        output: null,
        continue: false,
        json: false,
        quiet: false,
        timeout: 30000,
        help: false,
        version: false
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
            case '--timeout':
                opts.timeout = parseInt(argv[++i], 10) * 1000;
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
meo-agent — wget-like CLI for downloading files

Usage:
  meo-agent [options] <URL>

Options:
  -o, --output <name>     Save to a custom filename (default: URL basename)
  -c, --continue          Resume a partial download if supported by server
  -j, --json              Emit machine-readable JSON events to stdout
  -q, --quiet             Suppress progress output (only errors)
      --timeout <sec>     Network timeout in seconds (default: 30)
  -V, --version           Print version and exit
  -h, --help              Print this help and exit

Examples:
  meo-agent https://example.com/file.zip
  meo-agent -o backup.zip https://example.com/file.zip
  meo-agent --json https://example.com/file.zip | jq

Repository: https://github.com/meocode-labs/meo-agent
`.trim();
    console.log(help);
}

module.exports = { parseArgs, printHelp };