"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Position_1 = require("./state/Position");
const Tutorial_1 = require("./state/Tutorial");
class Context {
    constructor(workspaceState) {
        this.onNew = async (tutorial) => {
            this.tutorial.set(tutorial);
            const position = await this.position.initPosition(this.workspaceState, tutorial);
            return { position };
        };
        this.onContinue = async (tutorial) => {
            const position = await this.position.continuePosition(this.workspaceState, tutorial);
            return { position };
        };
        this.workspaceState = workspaceState;
        this.tutorial = new Tutorial_1.default(workspaceState);
        this.position = new Position_1.default();
    }
}
exports.default = Context;
//# sourceMappingURL=context.js.map