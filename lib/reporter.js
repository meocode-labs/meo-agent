'use strict';

const fs = require('fs');
const path = require('path');

class Reporter {
    constructor(opts) {
        this.json = opts.json || false;
        this.quiet = opts.quiet || false;
        this.url = null;
        this.output = null;
        this.startedAt = 0;
        this.lastReport = 0;
        this.totalBytes = 0;
        this.receivedBytes = 0;
        this.barWidth = 30;
    }

    _emit(event, data) {
        if (this.json) {
            process.stdout.write(JSON.stringify({ event, ...data, ts: Date.now() }) + '\n');
        }
    }

    start(url, output) {
        this.url = url;
        this.output = output;
        this.startedAt = Date.now();
        this.lastReport = this.startedAt;
        this.receivedBytes = 0;
        this.totalBytes = 0;

        if (!this.quiet && !this.json) {
            process.stderr.write(`Downloading ${url}\n  → ${output}\n`);
        }
        this._emit('start', { url, output });
    }

    setTotal(bytes) {
        this.totalBytes = bytes;
    }

    progress(received) {
        this.receivedBytes = received;
        const now = Date.now();

        if (this.json) {
            this._emit('progress', {
                received,
                total: this.totalBytes,
                percent: this.totalBytes ? Math.round((received / this.totalBytes) * 100) : null
            });
            return;
        }

        if (this.quiet) return;

        if (now - this.lastReport < 100 && this.totalBytes) return;
        this.lastReport = now;

        const percent = this.totalBytes ? Math.min(100, Math.round((received / this.totalBytes) * 100)) : 0;
        const filled = Math.round((percent / 100) * this.barWidth);
        const empty = this.barWidth - filled;
        const bar = '█'.repeat(filled) + '░'.repeat(empty);
        const mbReceived = (received / 1024 / 1024).toFixed(2);
        const mbTotal = this.totalBytes ? (this.totalBytes / 1024 / 1024).toFixed(2) : '?';

        process.stderr.write(`\r  [${bar}] ${percent}%  ${mbReceived} / ${mbTotal} MB`);
    }

    finish({ statusCode, resumed }) {
        const elapsed = ((Date.now() - this.startedAt) / 1000).toFixed(2);
        const mb = (this.receivedBytes / 1024 / 1024).toFixed(2);

        if (!this.json) {
            if (!this.quiet && this.totalBytes) {
                process.stderr.write('\n');
            }
            if (!this.quiet) {
                process.stderr.write(`✓ Saved to ${this.output} (${mb} MB in ${elapsed}s${resumed ? ', resumed' : ''})\n`);
            }
        }

        this._emit('finish', {
            output: this.output,
            url: this.url,
            bytes: this.receivedBytes,
            elapsed_sec: parseFloat(elapsed),
            status: statusCode,
            resumed: resumed || false
        });
    }

    error(message, code) {
        if (this.json) {
            this._emit('error', { message, code: code || 'UNKNOWN' });
        } else {
            process.stderr.write(`✗ Error: ${message}\n`);
        }
    }

    info(message) {
        if (this.quiet || this.json) return;
        process.stderr.write(`${message}\n`);
    }
}

module.exports = Reporter;