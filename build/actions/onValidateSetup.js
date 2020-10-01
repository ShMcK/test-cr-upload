"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dependencies_1 = require("../services/dependencies");
const workspace_1 = require("../services/workspace");
const commands_1 = require("../commands");
const git_1 = require("../services/git");
const onValidateSetup = async () => {
    try {
        const isEmptyWorkspace = await workspace_1.checkWorkspaceEmpty();
        if (!isEmptyWorkspace) {
            const error = {
                type: 'WorkspaceNotEmpty',
                message: '',
                actions: [
                    {
                        label: 'Open Workspace',
                        transition: 'REQUEST_WORKSPACE',
                    },
                    {
                        label: 'Check Again',
                        transition: 'RETRY',
                    },
                ],
            };
            commands_1.send({ type: 'VALIDATE_SETUP_FAILED', payload: { error } });
            return;
        }
        const isGitInstalled = await dependencies_1.version('git');
        if (!isGitInstalled) {
            const error = {
                type: 'GitNotFound',
                message: '',
                actions: [
                    {
                        label: 'Check Again',
                        transition: 'RETRY',
                    },
                ],
            };
            commands_1.send({ type: 'VALIDATE_SETUP_FAILED', payload: { error } });
            return;
        }
        const isGitUserNameConfigured = await git_1.validateGitConfig('user.name');
        const isGitUserEmailConfigured = await git_1.validateGitConfig('user.email');
        if (!isGitUserNameConfigured || !isGitUserEmailConfigured) {
            let message = '';
            if (!isGitUserNameConfigured)
                message += 'Git user not configured.\n';
            if (!isGitUserEmailConfigured)
                message += 'Git email not configured.';
            const error = {
                type: 'GitUserNotConfigured',
                message,
                actions: [
                    {
                        label: 'Check Again',
                        transition: 'RETRY',
                    },
                ],
            };
            commands_1.send({ type: 'VALIDATE_SETUP_FAILED', payload: { error } });
            return;
        }
        commands_1.send({ type: 'SETUP_VALIDATED' });
    }
    catch (e) {
        const error = {
            type: 'UknownError',
            message: e.message,
        };
        commands_1.send({ type: 'VALIDATE_SETUP_FAILED', payload: { error } });
    }
};
exports.default = onValidateSetup;
//# sourceMappingURL=onValidateSetup.js.map