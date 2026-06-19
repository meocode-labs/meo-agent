'use strict';

const crypto = require('crypto');
const fs = require('fs');

function verifyFile(filePath, expectedSha256) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);

        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('end', () => {
            const actual = hash.digest('hex');
            const ok = actual.toLowerCase() === expectedSha256.toLowerCase();
            resolve({ ok, actual, expected: expectedSha256 });
        });
        stream.on('error', reject);
    });
}

function parseChecksumArg(arg) {
    if (arg.includes('=')) {
        const [_, hash] = arg.split('=');
        return hash;
    }
    return arg;
}

module.exports = { verifyFile, parseChecksumArg };