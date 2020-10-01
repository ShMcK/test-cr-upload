"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const semver_1 = require("semver");
const telemetry_1 = require("../services/telemetry");
const dependencies_1 = require("../services/dependencies");
const tutorialConfig_1 = require("./utils/tutorialConfig");
const commands_1 = require("../commands");
const onTutorialConfigNew = async (action, context) => {
    var _a, _b;
    try {
        const data = action.payload.tutorial;
        telemetry_1.onEvent('tutorial_start', {
            tutorialId: data.id,
            tutorialVersion: data.version,
            tutorialTitle: data.summary.title,
        });
        const expectedAppVersion = (_b = (_a = data.config) === null || _a === void 0 ? void 0 : _a.appVersions) === null || _b === void 0 ? void 0 : _b.vscode;
        if (expectedAppVersion) {
            const extension = vscode.extensions.getExtension('coderoad.coderoad');
            if (extension) {
                const currentAppVersion = extension.packageJSON.version;
                const satisfied = semver_1.satisfies(currentAppVersion, expectedAppVersion);
                if (!satisfied) {
                    const error = {
                        type: 'UnmetExtensionVersion',
                        message: `Expected CodeRoad v${expectedAppVersion}, but found v${currentAppVersion}`,
                    };
                    commands_1.send({ type: 'TUTORIAL_CONFIGURE_FAIL', payload: { error } });
                    return;
                }
            }
        }
        await context.onNew(data);
        const dependencies = data.config.dependencies;
        if (dependencies && dependencies.length) {
            for (const dep of dependencies) {
                const currentVersion = await dependencies_1.version(dep.name);
                if (!currentVersion) {
                    const error = {
                        type: 'MissingTutorialDependency',
                        message: dep.message || `Process "${dep.name}" is required but not found. It may need to be installed`,
                        actions: [
                            {
                                label: 'Check Again',
                                transition: 'TRY_AGAIN',
                            },
                        ],
                    };
                    commands_1.send({ type: 'TUTORIAL_CONFIGURE_FAIL', payload: { error } });
                    return;
                }
                const satisfiedDependency = await dependencies_1.compareVersions(currentVersion, dep.version);
                if (!satisfiedDependency) {
                    const error = {
                        type: 'UnmetTutorialDependency',
                        message: `Expected ${dep.name} to have version ${dep.version}, but found version ${currentVersion}`,
                        actions: [
                            {
                                label: 'Check Again',
                                transition: 'TRY_AGAIN',
                            },
                        ],
                    };
                    commands_1.send({ type: 'TUTORIAL_CONFIGURE_FAIL', payload: { error } });
                    return;
                }
                if (satisfiedDependency !== true) {
                    const error = satisfiedDependency || {
                        type: 'UnknownError',
                        message: `Something went wrong comparing dependency for ${dep.name}`,
                        actions: [
                            {
                                label: 'Try Again',
                                transition: 'TRY_AGAIN',
                            },
                        ],
                    };
                    commands_1.send({ type: 'TUTORIAL_CONFIGURE_FAIL', payload: { error } });
                    return;
                }
            }
        }
        const error = await tutorialConfig_1.default({ data }).catch((error) => ({
            type: 'UnknownError',
            message: `Location: tutorial config.\n\n${error.message}`,
        }));
        if (error && error.type) {
            commands_1.send({ type: 'TUTORIAL_CONFIGURE_FAIL', payload: { error } });
            return;
        }
        commands_1.send({ type: 'TUTORIAL_CONFIGURED' });
    }
    catch (e) {
        const error = {
            type: 'UnknownError',
            message: `Location: EditorTutorialConfig.\n\n ${e.message}`,
        };
        commands_1.send({ type: 'TUTORIAL_CONFIGURE_FAIL', payload: { error } });
    }
};
exports.default = onTutorialConfigNew;
//# sourceMappingURL=onTutorialConfigNew.js.map