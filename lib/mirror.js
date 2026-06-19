'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

function pickClient(u) {
    return u.protocol === 'https:' ? https : http;
}

const SKIP_PATTERNS = [
    /\?/,            // query strings
    /#/,             // fragments
    /\.(zip|tar|gz|tgz|7z|rar|exe|dmg|pkg|deb|rpm|iso)$/i
];

function shouldSkip(href) {
    return SKIP_PATTERNS.some((re) => re.test(href));
}

function isSameOrigin(a, b) {
    return a.host === b.host;
}

function fetchHtml(urlString, redirects = 0) {
    return new Promise((resolve, reject) => {
        if (redirects > 5) return reject(new Error('Too many redirects'));
        let u;
        try { u = new URL(urlString); } catch (e) { return reject(e); }

        const client = pickClient(u);
        const req = client.get(u, { timeout: 15000 }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                res.resume();
                const next = new URL(res.headers.location, u).toString();
                return resolve(fetchHtml(next, redirects + 1));
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`HTTP ${res.statusCode}`));
            }
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => resolve({ html: body, base: u }));
            res.on('error', reject);
        });
        req.on('timeout', () => req.destroy(new Error('timeout')));
        req.on('error', reject);
    });
}

function extractLinks(html, base) {
    const links = new Set();
    const hrefRe = /href\s*=\s*["']([^"']+)["']/gi;
    const srcRe = /src\s*=\s*["']([^"']+)["']/gi;

    const seen = new Set();
    for (const re of [hrefRe, srcRe]) {
        let m;
        while ((m = re.exec(html)) !== null) {
            seen.add(m[1]);
        }
    }

    for (const raw of seen) {
        if (raw.startsWith('mailto:') || raw.startsWith('javascript:') || raw.startsWith('#')) continue;
        try {
            const u = new URL(raw, base);
            u.hash = '';
            links.add(u.toString());
        } catch (e) {
            // ignore invalid URLs
        }
    }
    return Array.from(links);
}

async function mirror(baseUrlString, outputDir, opts = {}) {
    const visited = new Set();
    const queue = [baseUrlString];
    const downloaded = [];
    const maxDepth = opts.maxDepth || 2;
    const limit = opts.limit || 50;

    fs.mkdirSync(outputDir, { recursive: true });

    while (queue.length > 0 && downloaded.length < limit) {
        const url = queue.shift();
        if (visited.has(url)) continue;
        visited.add(url);

        if (shouldSkip(url)) continue;

        let result;
        try {
            result = await fetchHtml(url);
        } catch (err) {
            continue;
        }

        const baseU = result.base;
        const parsed = new URL(url);

        let relPath;
        if (url === baseUrlString) {
            relPath = 'index.html';
        } else {
            relPath = parsed.pathname.replace(/^\//, '') || 'index.html';
        }

        const outPath = path.join(outputDir, relPath);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, result.html);

        downloaded.push({ url, output: outPath });

        if (downloaded.length - 1 < maxDepth) {
            const links = extractLinks(result.html, baseU);
            for (const link of links) {
                try {
                    const lu = new URL(link);
                    if (isSameOrigin(lu, baseU) && !visited.has(link)) {
                        queue.push(link);
                    }
                } catch (e) {
                    // ignore
                }
            }
        }
    }

    return downloaded;
}

module.exports = { mirror, fetchHtml, extractLinks };