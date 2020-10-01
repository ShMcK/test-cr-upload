"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetWatchers = exports.loadWatchers = void 0;
const chokidar = require("chokidar");
const vscode = require("vscode");
const commands_1 = require("../../../commands");
const environment_1 = require("../../../environment");
const watcherObject = {};
const disposeWatcher = (watcher) => {
    watcherObject[watcher].close();
    delete watcherObject[watcher];
};
exports.loadWatchers = (watchers = []) => {
    if (!watchers.length) {
        for (const watcher of Object.keys(watcherObject)) {
            disposeWatcher(watcher);
        }
    }
    for (const watcher of watchers) {
        if (!watcherObject[watcher]) {
            const fsWatcher = chokidar.watch(watcher, {
                cwd: environment_1.WORKSPACE_ROOT,
                interval: 1000,
            });
            const lastFire = null;
            fsWatcher.on('change', (path, event) => {
                const now = +new Date();
                if (!lastFire || lastFire - now > 1000) {
                    vscode.commands.executeCommand(commands_1.COMMANDS.RUN_TEST, {
                        callbacks: {
                            onSuccess: () => {
                                disposeWatcher(watcher);
                            },
                        },
                    });
                }
            });
            watcherObject[watcher] = fsWatcher;
        }
    }
};
exports.resetWatchers = () => {
    for (const watcher of Object.keys(watcherObject)) {
        disposeWatcher(watcher);
    }
};
//# sourceMappingURL=watchers.js.map