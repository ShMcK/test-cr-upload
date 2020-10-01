"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareVersions = exports.version = void 0;
const semver_1 = require("semver");
const node_1 = require("../node");
const semverRegex = /(?<=^v?|\sv?)(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:0|[1-9]\d*|[\da-z-]*[a-z-][\da-z-]*)(?:\.(?:0|[1-9]\d*|[\da-z-]*[a-z-][\da-z-]*))*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?(\.windows.[0-9]+)?(?=$|\s)/gi;
exports.version = async (name) => {
    try {
        const { stdout, stderr } = await node_1.exec({ command: `${name} --version` });
        if (!stderr) {
            const match = stdout.match(semverRegex);
            if (match) {
                const parsedVersion = match[0].split('.').slice(0, 3).join('.');
                return parsedVersion;
            }
        }
        return null;
    }
    catch (error) {
        return null;
    }
};
exports.compareVersions = async (currentVersion, expectedVersion) => {
    return semver_1.satisfies(currentVersion, expectedVersion);
};
//# sourceMappingURL=index.js.map