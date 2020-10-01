"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reset_1 = require("../services/reset");
const hooks = require("../services/hooks");
const lastHash_1 = require("../services/reset/lastHash");
const onRunReset = async (action, context) => {
    var _a;
    const tutorial = context.tutorial.get();
    const position = action.position ? action.position : context.position.get();
    const hash = lastHash_1.default(position, tutorial);
    const branch = tutorial === null || tutorial === void 0 ? void 0 : tutorial.config.repo.branch;
    if (!branch) {
        console.error('No repo branch found for tutorial');
        return;
    }
    reset_1.default({ branch, hash });
    const resetActions = (_a = tutorial === null || tutorial === void 0 ? void 0 : tutorial.config) === null || _a === void 0 ? void 0 : _a.reset;
    if (resetActions) {
        hooks.onReset({ commands: resetActions === null || resetActions === void 0 ? void 0 : resetActions.commands, vscodeCommands: resetActions === null || resetActions === void 0 ? void 0 : resetActions.vscodeCommands });
    }
};
exports.default = onRunReset;
//# sourceMappingURL=onRunReset.js.map