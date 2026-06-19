#!/usr/bin/env node
const fs = require('fs');
const https = require('https');
const http = require('http');

const url = process.argv[2];
if (!url) {
    console.log("Gunakan: meo-agent [URL]");
    process.exit(1);
}

const fileName = url.split('/').pop() || 'index.html';
const client = url.startsWith('https') ? https : http;

console.log(`Mengunduh ${url}...`);

client.get(url, (res) => {
    const fileStream = fs.createWriteStream(fileName);
    res.pipe(fileStream);

    fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Selesai! Disimpan sebagai ${fileName}`);
    });
}).on('error', (err) => {
    console.error(`Error: ${err.message}`);
});