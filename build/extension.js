"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const commands_1 = require("./commands");
const telemetry = require("./services/telemetry");
let onDeactivate = () => {
};
exports.activate = (vscodeExt) => {
    vscode.commands.executeCommand('vscode.setEditorLayout', {
        orientation: 0,
        groups: [{ size: 0.6 }, { size: 0.4 }],
    });
    const commands = commands_1.createCommands({
        extensionPath: vscodeExt.extensionPath,
        workspaceState: vscodeExt.workspaceState,
    });
    const subscribe = (sub) => {
        vscodeExt.subscriptions.push(sub);
    };
    for (const cmd in commands) {
        const command = vscode.commands.registerCommand(cmd, commands[cmd]);
        subscribe(command);
    }
    telemetry.activate(subscribe);
    onDeactivate = () => {
        for (const disposable of vscodeExt.subscriptions) {
            disposable.dispose();
        }
        telemetry.deactivate();
    };
};
exports.deactivate = () => onDeactivate();
//# sourceMappingURL=extension.js.map