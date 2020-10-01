"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const tutorialConfig_1 = require("./utils/tutorialConfig");
const commands_1 = require("../commands");
const logger_1 = require("../services/logger");
const onTutorialConfigContinue = async (action, context) => {
    logger_1.default('onTutorialConfigContinue', action);
    try {
        const tutorialToContinue = context.tutorial.get();
        if (!tutorialToContinue) {
            throw new Error('Invalid tutorial to continue');
        }
        vscode.commands.executeCommand(commands_1.COMMANDS.SET_CURRENT_POSITION, action.payload.position);
        await tutorialConfig_1.default({
            data: tutorialToContinue,
            alreadyConfigured: true,
        });
    }
    catch (e) {
        const error = {
            type: 'UnknownError',
            message: `Location: Editor tutorial continue config.\n\n ${e.message}`,
        };
        commands_1.send({ type: 'CONTINUE_FAILED', payload: { error } });
    }
};
exports.default = onTutorialConfigContinue;
//# sourceMappingURL=onTutorialConfigContinue.js.map