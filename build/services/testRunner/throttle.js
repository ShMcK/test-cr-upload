"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = exports.throttle = void 0;
let lastRun = new Date();
const THROTTLE_OFFSET = 300;
exports.throttle = () => {
    const now = new Date();
    if (+now > +lastRun + THROTTLE_OFFSET) {
        lastRun = now;
        return lastRun;
    }
    return null;
};
exports.debounce = (startTime) => +lastRun < +startTime + THROTTLE_OFFSET;
//# sourceMappingURL=throttle.js.map