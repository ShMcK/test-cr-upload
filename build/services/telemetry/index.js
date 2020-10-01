"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onEvent = exports.onError = exports.deactivate = exports.activate = void 0;
const vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
const environment_1 = require("../../environment");
const logger_1 = require("../logger");
let reporter;
exports.activate = (subscribeFn) => {
    logger_1.default(environment_1.EXTENSION_ID, environment_1.VERSION, environment_1.INSTRUMENTATION_KEY);
    reporter = new vscode_extension_telemetry_1.default(environment_1.EXTENSION_ID, environment_1.VERSION, environment_1.INSTRUMENTATION_KEY);
    subscribeFn(reporter);
};
exports.deactivate = () => {
    if (reporter) {
        reporter.dispose();
    }
};
exports.onError = (error, properties, measurements) => {
    logger_1.default(error, properties, measurements);
    if (reporter) {
        reporter.sendTelemetryException(error, properties, measurements);
    }
};
exports.onEvent = (eventName, properties, measurements) => {
    logger_1.default(eventName, properties, measurements);
    if (reporter) {
        reporter.sendTelemetryEvent(eventName, properties, measurements);
    }
};
//# sourceMappingURL=index.js.map