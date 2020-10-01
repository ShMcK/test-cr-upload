"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const commands_1 = require("./commands");
const context_1 = require("./services/context/context");
const logger_1 = require("./services/logger");
const workspace_1 = require("./services/workspace");
const actions = require("./actions");
const hooks = require("./services/hooks");
class Channel {
    constructor(workspaceState) {
        this.receive = async (action) => {
            const actionType = typeof action === 'string' ? action : action.type;
            logger_1.default(`EXT RECEIVED: "${actionType}"`);
            switch (actionType) {
                case 'EDITOR_STARTUP':
                    actions.onStartup(this.context);
                    return;
                case 'EDITOR_TUTORIAL_CONFIG':
                    actions.onTutorialConfigNew(action, this.context);
                    return;
                case 'EDITOR_TUTORIAL_CONTINUE_CONFIG':
                    actions.onTutorialConfigContinue(action, this.context);
                    return;
                case 'EDITOR_VALIDATE_SETUP':
                    actions.onValidateSetup();
                    return;
                case 'EDITOR_REQUEST_WORKSPACE':
                    workspace_1.openWorkspace();
                    return;
                case 'EDITOR_LEVEL_ENTER':
                case 'EDITOR_STEP_ENTER':
                    await vscode.commands.executeCommand(commands_1.COMMANDS.SET_CURRENT_POSITION, action.payload.position);
                    hooks.onSetupEnter(action.payload.actions);
                    return;
                case 'EDITOR_SOLUTION_ENTER':
                    await vscode.commands.executeCommand(commands_1.COMMANDS.SET_CURRENT_POSITION, action.payload.position);
                    hooks.onSolutionEnter(action.payload.actions);
                    return;
                case 'EDITOR_SYNC_POSITION':
                    await this.context.position.set(action.payload.position);
                    return;
                case 'EDITOR_OPEN_LOGS':
                    actions.onOpenLogs(action);
                    return;
                case 'EDITOR_RUN_TEST':
                    actions.runTest(action);
                    return;
                case 'EDITOR_RUN_RESET_LATEST':
                    actions.onRunReset({ type: 'LATEST' }, this.context);
                    return;
                case 'EDITOR_RUN_RESET_POSITION':
                    actions.onRunReset({ type: 'POSITION', position: action.payload.position }, this.context);
                    return;
                case 'EDITOR_STEP_COMPLETE':
                    hooks.onStepComplete(action.payload);
                    return;
                case 'EDITOR_LEVEL_COMPLETE':
                    hooks.onLevelComplete(action.payload);
                    return;
                case 'EDITOR_TUTORIAL_COMPLETE':
                    hooks.onTutorialComplete(action.payload);
                    return;
                default:
                    logger_1.default(`No match for action type: ${actionType}`);
                    return;
            }
        };
        this.context = new context_1.default(workspaceState);
    }
}
exports.default = Channel;
//# sourceMappingURL=channel.js.map