"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFailOutput = void 0;
exports.formatFailOutput = (tap) => {
    let output = `FAILED TEST LOG\n`;
    tap.failed.forEach((fail) => {
        const details = fail.details ? `\n${fail.details}\n` : '';
        const logs = fail.logs ? `\n${fail.logs.join('\n')}\n` : '';
        const result = `${logs}  ✘ ${fail.message}\n${details}`;
        output += result;
    });
    return output;
};
//# sourceMappingURL=formatOutput.js.map