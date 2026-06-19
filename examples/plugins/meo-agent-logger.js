'use strict';

module.exports = {
    name: 'meo-agent-logger',
    version: '1.0.0',
    description: 'Logs every download event to stderr',
    hooks: [
        {
            name: 'before_download',
            handler: async (ctx) => {
                process.stderr.write(`[logger] starting: ${ctx.url} → ${ctx.output}\n`);
            }
        },
        {
            name: 'after_download',
            handler: async (ctx) => {
                process.stderr.write(`[logger] finished: ${ctx.output} (${ctx.bytes} bytes)\n`);
            }
        }
    ]
};