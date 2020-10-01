"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommands = exports.send = exports.COMMANDS = void 0;
const testRunner_1 = require("./services/testRunner");
const webview_1 = require("./services/webview");
const hooks = require("./services/hooks");
const logger_1 = require("./services/logger");
const channel_1 = require("./channel");
exports.COMMANDS = {
    START: 'coderoad.start',
    CONFIG_TEST_RUNNER: 'coderoad.config_test_runner',
    RUN_TEST: 'coderoad.run_test',
    SET_CURRENT_POSITION: 'coderoad.set_current_position',
    ENTER: 'coderoad.enter',
};
let sendToClient = (action) => {
};
exports.send = (action) => {
    logger_1.default(`EXT TO CLIENT: "${typeof action === 'string' ? action : action.type}"`);
    if (action)
        sendToClient(action);
};
exports.createCommands = ({ extensionPath, workspaceState }) => {
    let webview;
    let currentPosition;
    let testRunner;
    const channel = new channel_1.default(workspaceState);
    return {
        [exports.COMMANDS.START]: async () => {
            if (webview && webview.state.loaded) {
                webview.createOrShow();
            }
            else {
                webview = await webview_1.default({
                    extensionPath,
                    channel,
                });
                sendToClient = webview.send;
            }
        },
        [exports.COMMANDS.CONFIG_TEST_RUNNER]: async ({ data, alreadyConfigured, }) => {
            if (!alreadyConfigured) {
                const setupActions = data.config.setup;
                if (setupActions) {
                    hooks.onInit(setupActions);
                }
            }
            testRunner = testRunner_1.default(data, {
                onSuccess: (position) => {
                    logger_1.default('test pass position', position);
                    channel.context.position.set({ ...position, complete: true });
                    exports.send({ type: 'TEST_PASS', payload: { position: { ...position, complete: true } } });
                },
                onFail: (position, failSummary) => {
                    exports.send({ type: 'TEST_FAIL', payload: { position, fail: failSummary } });
                },
                onError: (position) => {
                    const message = 'Error with test runner';
                    exports.send({ type: 'TEST_ERROR', payload: { position, message } });
                },
                onRun: (position) => {
                    exports.send({ type: 'TEST_RUNNING', payload: { position } });
                },
                onLoadSubtasks: ({ summary }) => {
                    exports.send({ type: 'LOAD_SUBTASK_RESULTS', payload: { summary } });
                },
            });
        },
        [exports.COMMANDS.SET_CURRENT_POSITION]: (position) => {
            currentPosition = position;
            channel.context.position.set(position);
        },
        [exports.COMMANDS.RUN_TEST]: ({ subtasks, callbacks, } = {}) => {
            testRunner({ position: currentPosition, onSuccess: callbacks === null || callbacks === void 0 ? void 0 : callbacks.onSuccess, subtasks });
        },
        [exports.COMMANDS.ENTER]: () => {
            exports.send({ type: 'KEY_PRESS_ENTER' });
        },
    };
};
//# sourceMappingURL=commands.js.map