"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("../../storage");
const defaultValue = {
    levelId: '',
    stepId: null,
    complete: false,
};
class Position {
    constructor() {
        this.get = () => {
            return this.value;
        };
        this.set = (value) => {
            var _a;
            this.value = value;
            (_a = this.storage) === null || _a === void 0 ? void 0 : _a.set(value);
            return this.value;
        };
        this.reset = () => {
            return this.set(defaultValue);
        };
        this.value = defaultValue;
    }
    setTutorial(workspaceState, tutorial) {
        this.storage = new storage_1.default({
            key: `coderoad:position:${tutorial.id}:${tutorial.version}`,
            storage: workspaceState,
            defaultValue,
        });
    }
    async initPosition(workspaceState, tutorial) {
        this.setTutorial(workspaceState, tutorial);
        const initLevel = tutorial.levels.length ? tutorial.levels[0] : null;
        return this.set({
            levelId: (initLevel === null || initLevel === void 0 ? void 0 : initLevel.id) || '',
            stepId: (initLevel === null || initLevel === void 0 ? void 0 : initLevel.steps.length) ? initLevel.steps[0].id : null,
            complete: false,
        });
    }
    async continuePosition(workspaceState, tutorial) {
        var _a;
        this.setTutorial(workspaceState, tutorial);
        const position = (await ((_a = this.storage) === null || _a === void 0 ? void 0 : _a.get())) || defaultValue;
        return this.set(position);
    }
}
exports.default = Position;
//# sourceMappingURL=Position.js.map