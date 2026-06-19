'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_PATHS = [
    path.join(process.cwd(), '.meo-agent.json'),
    path.join(os.homedir(), '.meo-agent.json'),
    path.join(os.homedir(), '.config', 'meo-agent', 'config.json')
];

const DEFAULT_CONFIG = {
    outputDir: null,
    timeout: 30,
    retries: 0,
    headers: {},
    plugins: [],
    defaultChecksum: null,
    mirrorMaxDepth: 2,
    mirrorLimit: 50
};

function loadConfig(customPath) {
    let config = { ...DEFAULT_CONFIG };

    const pathsToCheck = customPath ? [customPath] : CONFIG_PATHS;

    for (const p of pathsToCheck) {
        try {
            if (fs.existsSync(p)) {
                const content = fs.readFileSync(p, 'utf8');
                const parsed = JSON.parse(content);
                config = { ...config, ...parsed };
                config._loadedFrom = p;
                break;
            }
        } catch (err) {
            // ignore malformed config
        }
    }

    return config;
}

function saveConfig(configPath, config) {
    const dir = path.dirname(configPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

module.exports = { loadConfig, saveConfig, DEFAULT_CONFIG, CONFIG_PATHS };