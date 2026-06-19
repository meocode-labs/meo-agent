'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const PLUGIN_DIRS = [
    path.join(process.cwd(), '.meo-agent', 'plugins'),
    path.join(os.homedir(), '.meo-agent', 'plugins'),
    path.join(os.homedir(), '.config', 'meo-agent', 'plugins')
];

class PluginManager {
    constructor(reporter) {
        this.reporter = reporter;
        this.plugins = [];
        this.hooks = {};
    }

    register(plugin) {
        if (!plugin || typeof plugin.name !== 'string') {
            throw new Error('Plugin must have a name');
        }
        this.plugins.push(plugin);
        for (const hook of plugin.hooks || []) {
            if (!this.hooks[hook.name]) this.hooks[hook.name] = [];
            this.hooks[hook.name].push(hook.handler);
        }
        if (this.reporter && this.reporter.info) {
            this.reporter.info(`Plugin loaded: ${plugin.name} v${plugin.version || '0.0.0'}`);
        }
    }

    async trigger(hookName, context = {}) {
        const handlers = this.hooks[hookName] || [];
        for (const handler of handlers) {
            try {
                await handler(context);
            } catch (err) {
                if (this.reporter) {
                    this.reporter.error(`Plugin hook '${hookName}' failed: ${err.message}`);
                }
            }
        }
    }

    loadFromDir(dir) {
        if (!fs.existsSync(dir)) return 0;
        let loaded = 0;
        for (const entry of fs.readdirSync(dir)) {
            const full = path.join(dir, entry);
            try {
                const stat = fs.statSync(full);
                let pluginModule;
                if (stat.isDirectory()) {
                    const pkg = path.join(full, 'package.json');
                    const main = path.join(full, fs.existsSync(pkg) ? require(pkg).main || 'index.js' : 'index.js');
                    pluginModule = require(path.resolve(main));
                } else if (entry.endsWith('.js')) {
                    pluginModule = require(path.resolve(full));
                } else {
                    continue;
                }
                this.register(pluginModule);
                loaded++;
            } catch (err) {
                if (this.reporter) {
                    this.reporter.error(`Failed to load plugin from ${full}: ${err.message}`);
                }
            }
        }
        return loaded;
    }

    loadAll() {
        let total = 0;
        for (const dir of PLUGIN_DIRS) {
            total += this.loadFromDir(dir);
        }
        return total;
    }

    list() {
        return this.plugins.map((p) => ({
            name: p.name,
            version: p.version || '0.0.0',
            description: p.description || '',
            hooks: (p.hooks || []).map((h) => h.name)
        }));
    }
}

module.exports = { PluginManager, PLUGIN_DIRS };