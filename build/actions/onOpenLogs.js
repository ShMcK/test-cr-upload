"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onOpenLogs = void 0;
const output_1 = require("../services/testRunner/output");
exports.onOpenLogs = async (action) => {
    const channel = action.payload.channel;
    await output_1.showOutput(channel);
};
exports.default = exports.onOpenLogs;
//# sourceMappingURL=onOpenLogs.js.map