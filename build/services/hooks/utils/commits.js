"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCommits = void 0;
const git = require("../../git");
const verifyCommitUnique = async (hash) => {
    const message = await git.getCommitMessage(hash);
    if (!message) {
        return false;
    }
    const exists = await git.commitsExistsByMessage(message);
    return exists;
};
exports.loadCommits = async (commits = []) => {
    if (commits && commits.length) {
        for (const commit of commits) {
            const commitExists = await verifyCommitUnique(commit);
            if (!commitExists) {
                await git.loadCommit(commit);
            }
        }
    }
};
//# sourceMappingURL=commits.js.map