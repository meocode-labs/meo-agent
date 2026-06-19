#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { parseArgs, printHelp } = require('../lib/args');
const Reporter = require('../lib/reporter');
const { download, deriveFilename } = require('../lib/downloader');
const { doctor } = require('../lib/doctor');

const pkg = require('../package.json');

async function main() {
    const opts = parseArgs(process.argv);

    if (opts.version) {
        console.log(`meo-agent ${pkg.version}`);
        process.exit(0);
    }

    if (opts.help) {
        printHelp();
        process.exit(0);
    }

    if (process.argv.includes('doctor')) {
        const results = await doctor();
        if (opts.json) {
            console.log(JSON.stringify({ event: 'doctor', results }, null, 2));
        } else {
            console.log('meo-agent doctor — environment diagnostics\n');
            for (const r of results) {
                const icon = r.status === 'ok' ? '✓' : '✗';
                console.log(`  ${icon} ${r.label.padEnd(36)} ${r.detail}`);
            }
            const failed = results.filter(r => r.status === 'fail').length;
            console.log(`\n${results.length - failed}/${results.length} checks passed.`);
            process.exit(failed > 0 ? 1 : 0);
        }
        return;
    }

    if (!opts.url) {
        if (opts.json) {
            console.log(JSON.stringify({ event: 'error', message: 'Missing URL', code: 'MISSING_URL' }));
        } else {
            process.stderr.write('Error: Missing URL\n');
            printHelp();
        }
        process.exit(1);
    }

    opts.output = opts.output || deriveFilename(opts.url);

    const reporter = new Reporter(opts);
    reporter.start(opts.url, opts.output);

    try {
        await download(opts, reporter);
        process.exit(0);
    } catch (err) {
        reporter.error(err.message, err.code || 'DOWNLOAD_FAILED');
        process.exit(1);
    }
}

main().catch((err) => {
    process.stderr.write(`Fatal: ${err.stack || err.message}\n`);
    process.exit(1);
});