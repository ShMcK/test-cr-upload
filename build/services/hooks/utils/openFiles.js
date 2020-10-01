"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const vscode = require("vscode");
const openFiles = async (files = []) => {
    if (!files.length) {
        return;
    }
    for (const filePath of files) {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || !workspaceFolders.length) {
                throw new Error('No workspace directory. Open a workspace directory and try again');
            }
            const wr = workspaceFolders[0].uri.path;
            const absoluteFilePath = path_1.join(wr, filePath);
            const doc = await vscode.workspace.openTextDocument(absoluteFilePath);
            await vscode.window.showTextDocument(doc, vscode.ViewColumn.One);
        }
        catch (error) {
            console.log(`Failed to open file ${filePath}: ${error.message}`);
        }
    }
};
exports.default = openFiles;
//# sourceMappingURL=openFiles.js.map