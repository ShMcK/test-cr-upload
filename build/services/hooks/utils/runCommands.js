"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../node");
const commands_1 = require("../../../commands");
const runCommands = async (commands = []) => {
    if (!commands.length) {
        return;
    }
    for (const command of commands) {
        const process = {
            title: command,
            description: 'Running process...',
        };
        commands_1.send({ type: 'COMMAND_START', payload: { process: { ...process, status: 'RUNNING' } } });
        let result;
        try {
            result = await node_1.exec({ command });
            console.log(result);
        }
        catch (error) {
            console.error(`Command failed: ${error.message}`);
            commands_1.send({ type: 'COMMAND_FAIL', payload: { process: { ...process, status: 'FAIL' } } });
            return;
        }
        commands_1.send({ type: 'COMMAND_SUCCESS', payload: { process: { ...process, status: 'SUCCESS' } } });
    }
};
exports.default = runCommands;
//# sourceMappingURL=runCommands.js.map