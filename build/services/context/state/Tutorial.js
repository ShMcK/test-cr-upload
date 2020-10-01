"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("../../storage");
class Tutorial {
    constructor(workspaceState) {
        this.value = null;
        this.get = () => {
            return this.value;
        };
        this.set = (value) => {
            this.value = value;
            this.storage.set(value);
        };
        this.reset = () => {
            this.set(null);
        };
        this.storage = new storage_1.default({
            key: 'coderoad:currentTutorial',
            storage: workspaceState,
            defaultValue: null,
        });
        this.storage.get().then((value) => {
            this.value = value;
        });
    }
}
exports.default = Tutorial;
//# sourceMappingURL=Tutorial.js.map