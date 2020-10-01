"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onTutorialComplete = exports.onLevelComplete = exports.onStepComplete = exports.onError = exports.onReset = exports.onSolutionEnter = exports.onSetupEnter = exports.onLevelEnter = exports.onInit = void 0;
const git = require("../git");
const commits_1 = require("./utils/commits");
const watchers_1 = require("./utils/watchers");
const openFiles_1 = require("./utils/openFiles");
const runCommands_1 = require("./utils/runCommands");
const runVSCodeCommands_1 = require("./utils/runVSCodeCommands");
const telemetry = require("../telemetry");
const onTest_1 = require("../../actions/onTest");
const environment_1 = require("../../environment");
exports.onInit = async (actions) => {
    await commits_1.loadCommits(actions === null || actions === void 0 ? void 0 : actions.commits);
    await runCommands_1.default(actions === null || actions === void 0 ? void 0 : actions.commands);
    await runVSCodeCommands_1.default(actions === null || actions === void 0 ? void 0 : actions.vscodeCommands);
};
exports.onLevelEnter = async (actions) => {
    await commits_1.loadCommits(actions === null || actions === void 0 ? void 0 : actions.commits);
    await runCommands_1.default(actions === null || actions === void 0 ? void 0 : actions.commands);
};
exports.onSetupEnter = async (actions) => {
    await commits_1.loadCommits(actions === null || actions === void 0 ? void 0 : actions.commits);
    await openFiles_1.default(actions === null || actions === void 0 ? void 0 : actions.files);
    await watchers_1.loadWatchers(actions === null || actions === void 0 ? void 0 : actions.watchers);
    await runCommands_1.default(actions === null || actions === void 0 ? void 0 : actions.commands);
    await runVSCodeCommands_1.default(actions === null || actions === void 0 ? void 0 : actions.vscodeCommands);
};
exports.onSolutionEnter = async (actions) => {
    await git.clear();
    await commits_1.loadCommits(actions === null || actions === void 0 ? void 0 : actions.commits);
    await openFiles_1.default(actions === null || actions === void 0 ? void 0 : actions.files);
    await runCommands_1.default(actions === null || actions === void 0 ? void 0 : actions.commands);
    await runVSCodeCommands_1.default(actions === null || actions === void 0 ? void 0 : actions.vscodeCommands);
    await onTest_1.runTest();
};
exports.onReset = async (actions) => {
    await watchers_1.resetWatchers();
    await runCommands_1.default(actions === null || actions === void 0 ? void 0 : actions.commands);
    await runVSCodeCommands_1.default(actions === null || actions === void 0 ? void 0 : actions.vscodeCommands);
};
exports.onError = async (error) => {
    telemetry.onError(error);
};
exports.onStepComplete = async ({ tutorialId, levelId, stepId, }) => {
    git.saveCommit(`Save progress: ${stepId}`);
    telemetry.onEvent('step_complete', { tutorialId, stepId, levelId, version: environment_1.VERSION });
};
exports.onLevelComplete = async ({ tutorialId, levelId, }) => {
    telemetry.onEvent('level_complete', { tutorialId, levelId, version: environment_1.VERSION });
};
exports.onTutorialComplete = async ({ tutorialId }) => {
    telemetry.onEvent('tutorial_complete', { tutorialId, version: environment_1.VERSION });
};
//# sourceMappingURL=index.js.map