"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = exports.removeFile = exports.exists = exports.exec = void 0;
const child_process_1 = require("child_process");
const fs = require("fs");
const path_1 = require("path");
const util_1 = require("util");
const environment_1 = require("../../environment");
const asyncExec = util_1.promisify(child_process_1.exec);
const asyncRemoveFile = util_1.promisify(fs.unlink);
const asyncReadFile = util_1.promisify(fs.readFile);
exports.exec = (params) => {
    const cwd = path_1.join(environment_1.WORKSPACE_ROOT, params.dir || '');
    return asyncExec(params.command, { cwd });
};
exports.exists = (...paths) => {
    return fs.existsSync(path_1.join(environment_1.WORKSPACE_ROOT, ...paths));
};
exports.removeFile = (...paths) => {
    return asyncRemoveFile(path_1.join(environment_1.WORKSPACE_ROOT, ...paths));
};
exports.readFile = (...paths) => {
    return asyncReadFile(path_1.join(...paths));
};
//# sourceMappingURL=index.js.map