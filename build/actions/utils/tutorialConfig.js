"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const commands_1 = require("../../commands");
const git = require("../../services/git");
const environment_1 = require("../../environment");
const tutorialConfig = async ({ data, alreadyConfigured }) => {
    if (!alreadyConfigured) {
        const initError = await git.initIfNotExists().catch((error) => ({
            type: 'GitNotFound',
            message: error.message,
            actions: [{ label: 'Retry', transition: 'TRY_AGAIN' }],
        }));
        if (initError) {
            return initError;
        }
        const remoteConnectError = await git.checkRemoteConnects(data.config.repo).catch((error) => ({
            type: 'FailedToConnectToGitRepo',
            message: error.message,
            actions: [{ label: 'Retry', transition: 'TRY_AGAIN' }],
        }));
        if (remoteConnectError) {
            return remoteConnectError;
        }
        const coderoadRemoteError = await git.setupCodeRoadRemote(data.config.repo.uri).catch((error) => ({
            type: 'GitRemoteAlreadyExists',
            message: error.message,
        }));
        if (coderoadRemoteError) {
            return coderoadRemoteError;
        }
    }
    await vscode.commands.executeCommand(commands_1.COMMANDS.CONFIG_TEST_RUNNER, { data, alreadyConfigured });
    if (!environment_1.DISABLE_RUN_ON_SAVE) {
        const shouldRunTest = (document) => {
            if (document.uri.scheme !== 'file') {
                return false;
            }
            return true;
        };
        vscode.workspace.onDidSaveTextDocument((document) => {
            if (shouldRunTest(document)) {
                vscode.commands.executeCommand(commands_1.COMMANDS.RUN_TEST);
            }
        });
    }
};
exports.default = tutorialConfig;
//# sourceMappingURL=tutorialConfig.js.map