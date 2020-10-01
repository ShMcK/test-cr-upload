"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const runVSCodeCommands = async (commands = []) => {
    if (!commands.length) {
        return;
    }
    for (const command of commands) {
        if (typeof command === 'string') {
            await vscode.commands.executeCommand(command);
        }
        else if (Array.isArray(command)) {
            const [name, params] = command;
            await vscode.commands.executeCommand(name, params);
        }
    }
};
exports.default = runVSCodeCommands;
//# sourceMappingURL=runVSCodeCommands.js.map