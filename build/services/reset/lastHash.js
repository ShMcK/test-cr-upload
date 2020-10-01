"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getLastCommitHash = (position, tutorial) => {
    var _a, _b;
    if (!tutorial) {
        throw new Error('No tutorial found');
    }
    const { levels } = tutorial;
    const { levelId, stepId } = position;
    let level = levels.find((l) => levelId === l.id);
    if (!level) {
        throw new Error(`No level found matching ${levelId}`);
    }
    if (!level.steps || !level.steps.length) {
        if (level.setup && level.setup.commits) {
            const levelCommits = level.setup.commits;
            return levelCommits[levelCommits.length - 1];
        }
        else {
            const levelIndex = levels.findIndex((l) => level.id === l.id);
            if (levelIndex > 0) {
                level = levels[levelIndex - 1];
            }
            else {
                const configCommits = (_a = tutorial.config.setup) === null || _a === void 0 ? void 0 : _a.commits;
                if (!configCommits) {
                    throw new Error('No commits found to reset back to');
                }
                return configCommits[configCommits.length - 1];
            }
        }
    }
    const step = level.steps.find((s) => stepId === s.id);
    if (!step) {
        throw new Error(`No step found matching ${stepId}`);
    }
    const commits = ((_b = step.setup) === null || _b === void 0 ? void 0 : _b.commits) || [];
    if (!commits.length) {
        throw new Error(`No commits found on step ${stepId}`);
    }
    return commits[commits.length - 1];
};
exports.default = getLastCommitHash;
//# sourceMappingURL=lastHash.js.map