"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTest = void 0;
const vscode = require("vscode");
const commands_1 = require("../commands");
exports.runTest = (action) => {
    vscode.commands.executeCommand(commands_1.COMMANDS.RUN_TEST, action === null || action === void 0 ? void 0 : action.payload);
};
//# sourceMappingURL=onTest.js.map