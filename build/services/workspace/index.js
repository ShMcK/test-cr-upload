"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceRoot = exports.checkWorkspaceEmpty = exports.openWorkspace = void 0;
const vscode = require("vscode");
const fs = require("fs");
const util_1 = require("util");
const env = require("../../environment");
const readDir = util_1.promisify(fs.readdir);
exports.openWorkspace = () => {
    const openInNewWindow = false;
    vscode.commands.executeCommand('vscode.openFolder', undefined, openInNewWindow);
};
exports.checkWorkspaceEmpty = async () => {
    let files;
    try {
        files = await readDir(env.WORKSPACE_ROOT, { encoding: 'utf8' });
    }
    catch (error) {
        throw new Error('Failed to check workspace');
    }
    return files.length === 0;
};
exports.getWorkspaceRoot = () => {
    const workspaceRoots = vscode.workspace.workspaceFolders;
    if (!workspaceRoots || !workspaceRoots.length) {
        return '';
    }
    const workspaceRoot = workspaceRoots[0];
    return workspaceRoot.uri.fsPath;
};
//# sourceMappingURL=index.js.map