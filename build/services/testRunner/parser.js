"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = {
    start: /^(not ok)|(ok)/,
    fail: /^not ok (?<index>\d+)\s(\-\s)?(?<message>.+)$/,
    pass: /^ok (?<index>\d+)\s(\-\s)?(?<message>.+)$/,
    details: /^#\s{1,2}(?<message>.+)$/,
    ignore: /^(1\.\.[0-9]+)|(#\s+(tests|pass|fail|skip)\s+[0-9]+)$/,
};
const detect = (type, text) => {
    const match = r[type].exec(text);
    if (!match) {
        return null;
    }
    return match.groups;
};
const formatMessage = (message) => {
    var _a;
    const isTappy = message.match(/^test_(?<underscoredMessage>.+)\s(?<testPath>.+)$/);
    if ((_a = isTappy === null || isTappy === void 0 ? void 0 : isTappy.groups) === null || _a === void 0 ? void 0 : _a.underscoredMessage) {
        return isTappy.groups.underscoredMessage.split('_').join(' ').trim();
    }
    return message.trim();
};
const parser = (text) => {
    const lineList = text.split('\n');
    const startingPoint = lineList.findIndex((t) => t.match(r.start));
    const lines = lineList.slice(startingPoint);
    const result = {
        ok: true,
        passed: [],
        failed: [],
        logs: [],
        summary: {},
    };
    let currentDetails = null;
    let logs = [];
    const addCurrentDetails = () => {
        const failLength = result.failed.length;
        if (currentDetails && !!failLength) {
            result.failed[failLength - 1].details = currentDetails;
            currentDetails = null;
        }
    };
    for (const line of lines) {
        if (!line.length || !!r.ignore.exec(line)) {
            continue;
        }
        const isPass = detect('pass', line);
        if (!!isPass) {
            const message = formatMessage(isPass.message);
            const pass = { message };
            if (logs.length) {
                pass.logs = logs;
                logs = [];
            }
            result.passed.push(pass);
            result.summary[message] = true;
            addCurrentDetails();
            continue;
        }
        const isFail = detect('fail', line);
        if (!!isFail) {
            result.ok = false;
            addCurrentDetails();
            const message = formatMessage(isFail.message);
            const fail = { message };
            if (logs.length) {
                fail.logs = logs;
                logs = [];
            }
            result.failed.push(fail);
            result.summary[message] = false;
            continue;
        }
        const isDetails = detect('details', line);
        if (!!isDetails) {
            const lineDetails = isDetails.message.trim();
            if (!currentDetails) {
                currentDetails = lineDetails;
            }
            else {
                currentDetails += `\n${lineDetails}`;
            }
            continue;
        }
        logs.push(line);
        result.logs.push(line);
    }
    addCurrentDetails();
    return result;
};
exports.default = parser;
//# sourceMappingURL=parser.js.map