"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISABLE_RUN_ON_SAVE = exports.TUTORIAL_URL = exports.OS_PLATFORM = exports.WORKSPACE_ROOT = exports.INSTRUMENTATION_KEY = exports.LOG = exports.NODE_ENV = exports.EXTENSION_ID = exports.VERSION = void 0;
const workspace_1 = require("./services/workspace");
const os = require("os");
exports.VERSION = require('../package.json').version;
exports.EXTENSION_ID = 'coderoad';
exports.NODE_ENV = process.env.NODE_ENV || 'development';
exports.LOG = false;
exports.INSTRUMENTATION_KEY = '6ff37c76-72f3-48e3-a1b9-d5636f519b7b';
exports.WORKSPACE_ROOT = workspace_1.getWorkspaceRoot();
exports.OS_PLATFORM = os.platform();
const supportedOS = [
    'win32',
    'darwin',
    'linux',
];
if (!supportedOS.includes(exports.OS_PLATFORM)) {
    throw new Error(`OS ${exports.OS_PLATFORM}" not supported with CodeRoad`);
}
exports.TUTORIAL_URL = process.env.CODEROAD_TUTORIAL_URL || null;
exports.DISABLE_RUN_ON_SAVE = (process.env.CODEROAD_DISABLE_RUN_ON_SAVE || '').toLowerCase() === 'true';
//# sourceMappingURL=environment.js.map