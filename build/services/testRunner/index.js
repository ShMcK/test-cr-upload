"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../node");
const logger_1 = require("../logger");
const parser_1 = require("./parser");
const subtasks_1 = require("./subtasks");
const throttle_1 = require("./throttle");
const telemetry_1 = require("../telemetry");
const output_1 = require("./output");
const formatOutput_1 = require("./formatOutput");
const failChannelName = 'CodeRoad (Tests)';
const logChannelName = 'CodeRoad (Logs)';
const createTestRunner = (data, callbacks) => {
    var _a;
    const testRunnerConfig = data.config.testRunner;
    const testRunnerFilterArg = (_a = testRunnerConfig.args) === null || _a === void 0 ? void 0 : _a.filter;
    return async ({ position, onSuccess }) => {
        var _a;
        const startTime = throttle_1.throttle();
        if (!startTime) {
            return;
        }
        logger_1.default('------------------- RUN TEST -------------------');
        const level = data.levels.find((l) => l.id === position.levelId) || null;
        if (!level) {
            console.warn(`Level "${position.levelId}" not found`);
            return;
        }
        const step = level.steps.find((s) => s.id === position.stepId) || null;
        if (!step) {
            console.warn(`Step "${position.stepId}" not found`);
            return;
        }
        callbacks.onRun(position);
        let result;
        try {
            let command = testRunnerConfig.args
                ? `${testRunnerConfig.command} ${testRunnerConfig === null || testRunnerConfig === void 0 ? void 0 : testRunnerConfig.args.tap}`
                : testRunnerConfig.command;
            if (testRunnerFilterArg) {
                const levels = data.levels;
                const level = levels.find((l) => l.id === position.levelId);
                const step = level === null || level === void 0 ? void 0 : level.steps.find((s) => s.id === position.stepId);
                const testFilter = (_a = step === null || step === void 0 ? void 0 : step.setup) === null || _a === void 0 ? void 0 : _a.filter;
                if (testFilter) {
                    command = [command, testRunnerFilterArg, testFilter].join(' ');
                }
            }
            logger_1.default('COMMAND', command);
            result = await node_1.exec({ command, dir: testRunnerConfig.directory });
        }
        catch (err) {
            result = { stdout: err.stdout, stderr: err.stack };
        }
        if (!throttle_1.debounce(startTime)) {
            return;
        }
        logger_1.default('----------------- PROCESS TEST -----------------');
        const { stdout, stderr } = result;
        const tap = parser_1.default(stdout || '');
        output_1.addOutput({ channel: logChannelName, text: tap.logs.join('\n'), show: false });
        if (stderr) {
            if (!tap.failed.length) {
                const failSummary = {
                    title: 'Test Runner Failed',
                    description: stderr,
                    summary: {},
                };
                callbacks.onFail(position, failSummary);
                return;
            }
            else if (stdout && stdout.length && !tap.ok) {
                const firstFail = tap.failed[0];
                const failSummary = {
                    title: firstFail.message || 'Test Failed',
                    description: firstFail.details || 'Unknown error',
                    summary: tap.summary,
                };
                if (step.subtasks) {
                    const subtaskSummary = subtasks_1.default(tap.summary, position.stepId || '');
                    callbacks.onFail(position, {
                        ...failSummary,
                        summary: subtaskSummary,
                    });
                }
                else {
                    callbacks.onFail(position, failSummary);
                }
                const output = formatOutput_1.formatFailOutput(tap);
                output_1.addOutput({ channel: failChannelName, text: output, show: true });
                return;
            }
            else {
                callbacks.onError(position);
                output_1.addOutput({ channel: failChannelName, text: stderr, show: true });
                return;
            }
        }
        if (tap.ok) {
            output_1.clearOutput(failChannelName);
            callbacks.onSuccess(position);
            if (onSuccess) {
                onSuccess();
            }
        }
        else {
            telemetry_1.onError(new Error(`Error with running test ${JSON.stringify(position)}`));
            callbacks.onError(position);
        }
    };
};
exports.default = createTestRunner;
//# sourceMappingURL=index.js.map