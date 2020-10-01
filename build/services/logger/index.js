"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("../../environment");
const logger = (...messages) => {
    if (!environment_1.LOG) {
        return;
    }
    for (const message of messages) {
        if (typeof message === 'object') {
            console.log(JSON.stringify(message));
        }
        else {
            console.log(message);
        }
    }
};
exports.default = logger;
//# sourceMappingURL=index.js.map