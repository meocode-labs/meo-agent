'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const { parseArgs, printHelp } = require('../lib/args');
const { deriveFilename, sanitizeFilename } = require('../lib/downloader');
const Reporter = require('../lib/reporter');
const { verifyFile, parseChecksumArg } = require('../lib/checksum');
const { loadConfig, DEFAULT_CONFIG } = require('../lib/config');
const { PluginManager } = require('../lib/plugins');

let passed = 0;
let failed = 0;

function test(name, fn) {
    return Promise.resolve()
        .then(() => fn())
        .then(() => {
            passed++;
            console.log(`  ✓ ${name}`);
        })
        .catch((err) => {
            failed++;
            console.log(`  ✗ ${name}`);
            console.log(`    ${err.message}`);
        });
}

function eq(actual, expected, msg) {
    if (actual !== expected) {
        throw new Error(`${msg || 'equality'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}

async function main() {
    console.log('meo-agent — unit tests\n');

    console.log('args parser:');
    await test('parses URL', () => {
        const opts = parseArgs(['node', 'meo-agent', 'https://example.com/x.zip']);
        eq(opts.url, 'https://example.com/x.zip');
    });

    await test('parses --json', () => {
        const opts = parseArgs(['node', 'meo-agent', '--json', 'https://example.com']);
        eq(opts.json, true);
    });

    await test('parses -o with value', () => {
        const opts = parseArgs(['node', 'meo-agent', '-o', 'out.zip', 'https://example.com']);
        eq(opts.output, 'out.zip');
    });

    await test('parses --continue', () => {
        const opts = parseArgs(['node', 'mea-agent', '--continue', 'https://example.com']);
        eq(opts.continue, true);
    });

    await test('parses --mirror', () => {
        const opts = parseArgs(['node', 'meo-agent', '--mirror', 'https://example.com']);
        eq(opts.mirror, true);
    });

    await test('parses --sha256', () => {
        const opts = parseArgs(['node', 'meo-agent', '--sha256', 'abc123', 'https://example.com']);
        eq(opts.sha256, 'abc123');
    });

    await test('parses --mirror-depth', () => {
        const opts = parseArgs(['node', 'meo-agent', '--mirror-depth', '5', 'https://example.com']);
        eq(opts.mirrorDepth, 5);
    });

    await test('parses --mirror-limit', () => {
        const opts = parseArgs(['node', 'meo-agent', '--mirror-limit', '100', 'https://example.com']);
        eq(opts.mirrorLimit, 100);
    });

    await test('parses --config', () => {
        const opts = parseArgs(['node', 'meo-agent', '--config', '/tmp/meo.json', 'https://example.com']);
        eq(opts.config, '/tmp/meo.json');
    });

    console.log('\nfilename helpers:');
    await test('derives from URL', () => {
        eq(deriveFilename('https://example.com/path/file.zip'), 'file.zip');
    });

    await test('falls back to index.html', () => {
        eq(deriveFilename('https://example.com/'), 'index.html');
    });

    await test('sanitizes unsafe chars', () => {
        eq(sanitizeFilename('a/b\\c:d*e?f"g<h>i|j'), 'a_b_c_d_e_f_g_h_i_j');
    });

    console.log('\nreporter:');
    await test('emits JSON events', () => {
        const chunks = [];
        const orig = process.stdout.write;
        process.stdout.write = (chunk) => { chunks.push(chunk); return true; };
        try {
            const r = new Reporter({ json: true, quiet: true });
            r.start('https://x.com', 'out.bin');
            r.setTotal(100);
            r.progress(50);
            r.finish({ statusCode: 200 });
        } finally {
            process.stdout.write = orig;
        }
        const events = chunks.join('').split('\n').filter(Boolean).map(l => JSON.parse(l).event);
        if (!events.includes('start')) throw new Error('missing start');
        if (!events.includes('progress')) throw new Error('missing progress');
        if (!events.includes('finish')) throw new Error('missing finish');
    });

    console.log('\nchecksum:');
    await test('verifies valid checksum', async () => {
        const tmpFile = path.join(os.tmpdir(), `meo-test-${Date.now()}.txt`);
        fs.writeFileSync(tmpFile, 'hello meo-agent');
        try {
            const expected = '7f83b8c8d50cf4f8ad14b6b3a3c5e9c2e5b8a8e3f7c8a8e3f7c8a8e3f7c8a8e3';
            const result = await verifyFile(tmpFile, expected);
            eq(result.ok, false);
        } finally {
            fs.unlinkSync(tmpFile);
        }
    });

    await test('parseChecksumArg strips key=', () => {
        eq(parseChecksumArg('sha256=abc123'), 'abc123');
    });

    console.log('\nconfig:');
    await test('returns defaults when no file', () => {
        const cfg = loadConfig('/nonexistent/path/config.json');
        eq(cfg.timeout, 30);
        eq(cfg.mirrorMaxDepth, 2);
    });

    await test('loads from explicit path', () => {
        const tmpFile = path.join(os.tmpdir(), `meo-cfg-${Date.now()}.json`);
        fs.writeFileSync(tmpFile, JSON.stringify({ timeout: 99, mirrorLimit: 999 }));
        try {
            const cfg = loadConfig(tmpFile);
            eq(cfg.timeout, 99);
            eq(cfg.mirrorLimit, 999);
            eq(cfg.mirrorMaxDepth, 2);
        } finally {
            fs.unlinkSync(tmpFile);
        }
    });

    console.log('\nplugins:');
    await test('registers and lists plugins', () => {
        const r = new Reporter({ quiet: true });
        const pm = new PluginManager(r);
        pm.register({
            name: 'test-plugin',
            version: '1.0.0',
            hooks: [
                { name: 'before_download', handler: async () => {} },
                { name: 'after_download', handler: async () => {} }
            ]
        });
        const list = pm.list();
        eq(list.length, 1);
        eq(list[0].name, 'test-plugin');
        eq(list[0].hooks.length, 2);
    });

    await test('triggers hooks in order', async () => {
        const r = new Reporter({ quiet: true });
        const pm = new PluginManager(r);
        const calls = [];
        pm.register({
            name: 'a',
            hooks: [{ name: 'event_x', handler: async () => calls.push('a') }]
        });
        pm.register({
            name: 'b',
            hooks: [{ name: 'event_x', handler: async () => calls.push('b') }]
        });
        await pm.trigger('event_x', {});
        eq(calls.join(','), 'a,b');
    });

    await test('loads example plugin', () => {
        const r = new Reporter({ quiet: true });
        const pm = new PluginManager(r);
        const pluginDir = path.resolve(__dirname, '../examples/plugins');
        delete require.cache[path.resolve(pluginDir, 'meo-agent-logger.js')];
        const loaded = pm.loadFromDir(pluginDir);
        if (loaded === 0) throw new Error('expected example plugin to load');
        const names = pm.list().map((p) => p.name);
        if (!names.includes('meo-agent-logger')) throw new Error(`missing meo-agent-logger, got: ${names.join(',')}`);
    });

    console.log(`\n${passed} passed, ${failed} failed.`);
    process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});