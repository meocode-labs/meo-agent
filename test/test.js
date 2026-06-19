'use strict';

const { parseArgs, printHelp } = require('../lib/args');
const { deriveFilename, sanitizeFilename } = require('../lib/downloader');
const Reporter = require('../lib/reporter');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        passed++;
        console.log(`  ✓ ${name}`);
    } catch (err) {
        failed++;
        console.log(`  ✗ ${name}`);
        console.log(`    ${err.message}`);
    }
}

function eq(actual, expected, msg) {
    if (actual !== expected) {
        throw new Error(`${msg || 'equality'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}

function truthy(actual, msg) {
    if (!actual) throw new Error(`${msg || 'truthy'}: got ${JSON.stringify(actual)}`);
}

console.log('meo-agent — unit tests\n');

console.log('args parser:');
test('parses URL', () => {
    const opts = parseArgs(['node', 'meo-agent', 'https://example.com/x.zip']);
    eq(opts.url, 'https://example.com/x.zip');
    eq(opts.json, false);
});

test('parses --json', () => {
    const opts = parseArgs(['node', 'meo-agent', '--json', 'https://example.com']);
    eq(opts.json, true);
    eq(opts.url, 'https://example.com');
});

test('parses -o with value', () => {
    const opts = parseArgs(['node', 'meo-agent', '-o', 'out.zip', 'https://example.com']);
    eq(opts.output, 'out.zip');
});

test('parses --continue', () => {
    const opts = parseArgs(['node', 'meo-agent', '--continue', 'https://example.com']);
    eq(opts.continue, true);
});

test('parses --timeout', () => {
    const opts = parseArgs(['node', 'meo-agent', '--timeout', '60', 'https://example.com']);
    eq(opts.timeout, 60000);
});

test('parses --version', () => {
    const opts = parseArgs(['node', 'meo-agent', '--version']);
    eq(opts.version, true);
});

console.log('\nfilename helpers:');
test('derives from URL', () => {
    eq(deriveFilename('https://example.com/path/file.zip'), 'file.zip');
});

test('falls back to index.html', () => {
    eq(deriveFilename('https://example.com/'), 'index.html');
});

test('sanitizes unsafe chars', () => {
    eq(sanitizeFilename('a/b\\c:d*e?f"g<h>i|j'), 'a_b_c_d_e_f_g_h_i_j');
});

test('respects length limit', () => {
    const long = 'a'.repeat(500) + '.zip';
    const result = sanitizeFilename(long);
    if (result.length > 255) throw new Error('too long');
});

console.log('\nreporter:');
test('emits JSON events', () => {
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
    const lines = chunks.join('').split('\n').filter(Boolean);
    const events = lines.map(l => JSON.parse(l).event);
    if (!events.includes('start')) throw new Error('missing start');
    if (!events.includes('progress')) throw new Error('missing progress');
    if (!events.includes('finish')) throw new Error('missing finish');
});

console.log(`\n${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);