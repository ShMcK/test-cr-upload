"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const commands_1 = require("../commands");
const environment_1 = require("../environment");
const node_fetch_1 = require("node-fetch");
const onStartup = async (context) => {
    try {
        const noActiveWorkspace = !environment_1.WORKSPACE_ROOT.length;
        if (noActiveWorkspace) {
            const error = {
                type: 'NoWorkspaceFound',
                message: '',
                actions: [
                    {
                        label: 'Open Workspace',
                        transition: 'REQUEST_WORKSPACE',
                    },
                ],
            };
            commands_1.send({ type: 'NO_WORKSPACE', payload: { error } });
            return;
        }
        const env = {
            machineId: vscode.env.machineId,
            sessionId: vscode.env.sessionId,
        };
        const tutorial = context.tutorial.get();
        if (!tutorial || !tutorial.id) {
            if (!!environment_1.TUTORIAL_URL) {
                try {
                    const tutorialRes = await node_fetch_1.default(environment_1.TUTORIAL_URL);
                    const tutorial = await tutorialRes.json();
                    commands_1.send({ type: 'START_TUTORIAL_FROM_URL', payload: { tutorial } });
                    return;
                }
                catch (e) {
                    console.log(`Failed to load tutorial from url ${environment_1.TUTORIAL_URL} with error "${e.message}"`);
                }
            }
            commands_1.send({ type: 'START_NEW_TUTORIAL', payload: { env } });
            return;
        }
        const { position } = await context.onContinue(tutorial);
        commands_1.send({ type: 'LOAD_STORED_TUTORIAL', payload: { env, tutorial, position } });
    }
    catch (e) {
        const error = {
            type: 'UnknownError',
            message: `Location: Editor startup\n\n${e.message}`,
        };
        commands_1.send({ type: 'EDITOR_STARTUP_FAILED', payload: { error } });
    }
};
exports.default = onStartup;
//# sourceMappingURL=onStartup.js.map