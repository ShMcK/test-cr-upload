"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseSubtasks = (summary, expectedStepId) => {
    const subtaskRegex = /^SUBTASKS\s(?<stepId>(\d+\.\d+))\s:(?<testId>\d+)\s/;
    const subtaskSummary = {};
    Object.keys(summary).forEach((key) => {
        const match = key.match(subtaskRegex);
        if (!!match) {
            const { stepId, testId } = match.groups || {};
            if (stepId === expectedStepId) {
                const testIndex = Number(testId) - 1;
                subtaskSummary[testIndex] = summary[key];
            }
        }
    });
    return subtaskSummary;
};
exports.default = parseSubtasks;
//# sourceMappingURL=subtasks.js.map