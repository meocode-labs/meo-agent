'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

function pickClient(parsedUrl) {
    return parsedUrl.protocol === 'https:' ? https : http;
}

function sanitizeFilename(name) {
    return name.replace(/[\\/:*?"<>|]/g, '_').slice(0, 255) || 'index.html';
}

function deriveFilename(urlString) {
    try {
        const u = new URL(urlString);
        const last = u.pathname.split('/').pop();
        return sanitizeFilename(last || 'index.html');
    } catch (e) {
        return 'index.html';
    }
}

function checkExisting(output, continueFlag) {
    if (!fs.existsSync(output)) {
        return { exists: false, offset: 0 };
    }
    if (!continueFlag) {
        return { exists: true, offset: 0 };
    }
    const stat = fs.statSync(output);
    return { exists: true, offset: stat.size };
}

function download(opts, reporter) {
    return new Promise((resolve, reject) => {
        let parsedUrl;
        try {
            parsedUrl = new URL(opts.url);
        } catch (e) {
            return reject(new Error(`Invalid URL: ${opts.url}`));
        }

        const client = pickClient(parsedUrl);
        const headers = { 'User-Agent': `meo-agent/1.0 (+https://github.com/meocode-labs/meo-agent)` };

        if (opts.continue && fs.existsSync(opts.output)) {
            const offset = fs.statSync(opts.output).size;
            headers['Range'] = `bytes=${offset}-`;
            reporter.info(`Resuming from byte ${offset}`);
        }

        const req = client.get(parsedUrl, { headers, timeout: opts.timeout }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                const redirectUrl = new URL(res.headers.location, parsedUrl).toString();
                reporter.info(`Redirect → ${redirectUrl}`);
                res.resume();
                return resolve(download({ ...opts, url: redirectUrl }, reporter));
            }

            if (res.statusCode >= 400) {
                return reject(new Error(`HTTP ${res.statusCode} ${res.statusMessage || ''}`.trim()));
            }

            const totalBytes = parseInt(res.headers['content-length'] || '0', 10) + (opts.continue ? checkExisting(opts.output, true).offset : 0);
            reporter.setTotal(totalBytes);

            const flags = (res.statusCode === 206 || (opts.continue && fs.existsSync(opts.output))) ? 'a' : 'w';
            const fileStream = fs.createWriteStream(opts.output, { flags });

            let received = (flags === 'a' && fs.existsSync(opts.output)) ? fs.statSync(opts.output).size : 0;
            reporter.progress(received);

            res.on('data', (chunk) => {
                received += chunk.length;
                reporter.progress(received);
            });

            res.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                reporter.finish({
                    statusCode: res.statusCode,
                    resumed: flags === 'a'
                });
                resolve({
                    output: opts.output,
                    url: opts.url,
                    bytes: received,
                    statusCode: res.statusCode,
                    resumed: flags === 'a'
                });
            });

            fileStream.on('error', (err) => {
                fs.unlink(opts.output, () => {});
                reject(err);
            });
        });

        req.on('timeout', () => {
            req.destroy(new Error(`Network timeout after ${opts.timeout / 1000}s`));
        });

        req.on('error', (err) => {
            reject(err);
        });
    });
}

module.exports = { download, deriveFilename, sanitizeFilename };