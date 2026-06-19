#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { parseArgs, printHelp } = require('../lib/args');
const Reporter = require('../lib/reporter');
const { download, deriveFilename } = require('../lib/downloader');
const { doctor } = require('../lib/doctor');
const { verifyFile, parseChecksumArg } = require('../lib/checksum');
const { mirror } = require('../lib/mirror');
const { loadConfig } = require('../lib/config');
const { PluginManager } = require('../lib/plugins');

const pkg = require('../package.json');

async function runDownload(opts, config, plugins, reporter) {
    if (!opts.url) {
        if (opts.json) {
            console.log(JSON.stringify({ event: 'error', message: 'Missing URL', code: 'MISSING_URL' }));
        } else {
            process.stderr.write('Error: Missing URL\n');
            printHelp();
        }
        process.exit(1);
    }

    const timeout = (opts.timeout || config.timeout) * 1000;
    const output = opts.output || (config.outputDir ? path.join(config.outputDir, deriveFilename(opts.url)) : deriveFilename(opts.url));

    reporter.start(opts.url, output);

    try {
        await plugins.trigger('before_download', { url: opts.url, output, opts, config });

        const result = await download({ ...opts, output, timeout }, reporter);

        await plugins.trigger('after_download', { ...result, opts, config });

        if (opts.sha256) {
            reporter.info(`Verifying SHA256: ${opts.sha256}`);
            const verify = await verifyFile(output, parseChecksumArg(opts.sha256));
            if (!verify.ok) {
                reporter.error(`Checksum mismatch: expected ${verify.expected}, got ${verify.actual}`, 'CHECKSUM_MISMATCH');
                process.exit(2);
            }
            reporter.info('✓ Checksum verified');
            if (opts.json) {
                console.log(JSON.stringify({ event: 'checksum_ok', expected: verify.expected, actual: verify.actual }));
            }
        }

        process.exit(0);
    } catch (err) {
        reporter.error(err.message, err.code || 'DOWNLOAD_FAILED');
        process.exit(1);
    }
}

async function runMirror(opts, config, plugins, reporter) {
    if (!opts.url) {
        reporter.error('Mirror requires a URL', 'MISSING_URL');
        process.exit(1);
    }
    const outDir = opts.output || './mirror';
    const mirrorOpts = {
        maxDepth: opts.mirrorDepth || config.mirrorMaxDepth,
        limit: opts.mirrorLimit || config.mirrorLimit
    };

    reporter.info(`Mirroring ${opts.url} → ${outDir} (depth=${mirrorOpts.maxDepth}, limit=${mirrorOpts.limit})`);

    try {
        const results = await mirror(opts.url, outDir, mirrorOpts);
        if (opts.json) {
            console.log(JSON.stringify({ event: 'mirror_done', count: results.length, results }));
        } else {
            reporter.info(`✓ Mirrored ${results.length} pages to ${outDir}`);
        }
        process.exit(0);
    } catch (err) {
        reporter.error(err.message, 'MIRROR_FAILED');
        process.exit(1);
    }
}

async function runDoctor(opts, config, plugins, reporter) {
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
}

async function runPlugins(opts, config, plugins, reporter) {
    const list = plugins.list();
    if (opts.json) {
        console.log(JSON.stringify({ event: 'plugins', plugins: list, loadedFrom: config._loadedFrom }));
    } else {
        if (list.length === 0) {
            console.log('No plugins loaded.');
        } else {
            console.log(`Loaded ${list.length} plugin(s):\n`);
            for (const p of list) {
                console.log(`  ${p.name} v${p.version}`);
                if (p.description) console.log(`    ${p.description}`);
                if (p.hooks && p.hooks.length) console.log(`    hooks: ${p.hooks.join(', ')}`);
            }
        }
    }
}

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

    const config = loadConfig(opts.config);
    const reporter = new Reporter({ json: opts.json, quiet: opts.quiet });
    const plugins = new PluginManager(reporter);
    const loaded = plugins.loadAll();

    if (loaded > 0 && !opts.quiet && !opts.json) {
        reporter.info(`Loaded ${loaded} plugin(s)`);
    }

    const isMirror = opts.mirror || process.argv.includes('mirror');
    const isDoctor = process.argv.includes('doctor');
    const isPlugins = opts.pluginList || process.argv.includes('plugins');

    if (isDoctor) return runDoctor(opts, config, plugins, reporter);
    if (isPlugins) return runPlugins(opts, config, plugins, reporter);
    if (isMirror) return runMirror(opts, config, plugins, reporter);

    return runDownload(opts, config, plugins, reporter);
}

main().catch((err) => {
    process.stderr.write(`Fatal: ${err.stack || err.message}\n`);
    process.exit(1);
});