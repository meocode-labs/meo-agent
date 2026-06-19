'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const http = require('http');

async function check(label, fn) {
    try {
        const result = await fn();
        return { label, status: 'ok', detail: result };
    } catch (err) {
        return { label, status: 'fail', detail: err.message };
    }
}

function doctor() {
    return new Promise(async (resolve) => {
        const checks = [];

        checks.push(await check('Node.js version', async () => {
            const v = process.version;
            const major = parseInt(v.slice(1), 10);
            if (major < 18) throw new Error(`${v} — requires Node 18+`);
            return v;
        }));

        checks.push(await check('Platform', async () => `${os.platform()} ${os.arch()} (${os.release()})`));

        checks.push(await check('Current directory writable', async () => {
            const testFile = path.join(process.cwd(), '.meo-agent-doctor.tmp');
            fs.writeFileSync(testFile, 'ok');
            fs.unlinkSync(testFile);
            return process.cwd();
        }));

        checks.push(await check('Temp directory writable', async () => {
            const testFile = path.join(os.tmpdir(), '.meo-agent-doctor.tmp');
            fs.writeFileSync(testFile, 'ok');
            fs.unlinkSync(testFile);
            return os.tmpdir();
        }));

        checks.push(await check('HTTPS connectivity (github.com)', async () => {
            return new Promise((res, rej) => {
                const req = https.get('https://github.com', { timeout: 10000 }, (r) => {
                    r.resume();
                    if (r.statusCode >= 200 && r.statusCode < 500) res(`HTTP ${r.statusCode}`);
                    else rej(new Error(`HTTP ${r.statusCode}`));
                });
                req.on('timeout', () => req.destroy(new Error('timeout')));
                req.on('error', rej);
            });
        }));

        checks.push(await check('HTTP connectivity (example.com)', async () => {
            return new Promise((res, rej) => {
                const req = http.get('http://example.com', { timeout: 10000 }, (r) => {
                    r.resume();
                    if (r.statusCode >= 200 && r.statusCode < 500) res(`HTTP ${r.statusCode}`);
                    else rej(new Error(`HTTP ${r.statusCode}`));
                });
                req.on('timeout', () => req.destroy(new Error('timeout')));
                req.on('error', rej);
            });
        }));

        checks.push(await check('Disk space', async () => {
            const df = require('child_process').execSync('df -k . 2>/dev/null || echo ""').toString();
            const lines = df.split('\n').filter(Boolean);
            if (lines.length < 2) return 'unknown';
            const parts = lines[1].split(/\s+/);
            const available = parseInt(parts[3] || '0', 10);
            const availableMB = (available / 1024).toFixed(0);
            if (available < 100 * 1024) throw new Error(`Only ${availableMB} MB available`);
            return `${availableMB} MB available`;
        }));

        resolve(checks);
    });
}

module.exports = { doctor };