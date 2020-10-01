"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGitConfig = exports.commitsExistsByMessage = exports.getCommitMessage = exports.getShortHash = exports.loadCommitHistory = exports.setupCodeRoadRemote = exports.checkRemoteExists = exports.addRemote = exports.checkRemoteConnects = exports.initIfNotExists = exports.clear = exports.saveCommit = exports.loadCommit = exports.gitOrigin = void 0;
const node_1 = require("../node");
const logger_1 = require("../logger");
exports.gitOrigin = 'coderoad';
const stashAllFiles = async () => {
    const { stdout, stderr } = await node_1.exec({ command: `git stash --include-untracked` });
    if (stderr) {
        console.error(stderr);
        throw new Error('Error stashing files');
    }
};
const cherryPickCommit = async (commit, count = 0) => {
    if (count > 1) {
        console.warn('cherry-pick failed');
        return;
    }
    try {
        const { stdout } = await node_1.exec({ command: `git cherry-pick -X theirs ${commit}` });
        if (!stdout) {
            throw new Error('No cherry-pick output');
        }
    }
    catch (error) {
        console.log('cherry-pick-commit failed');
        await stashAllFiles();
        return cherryPickCommit(commit, ++count);
    }
};
function loadCommit(commit) {
    return cherryPickCommit(commit);
}
exports.loadCommit = loadCommit;
async function saveCommit(message) {
    const { stdout, stderr } = await node_1.exec({ command: `git commit -am '${message}'` });
    if (stderr) {
        console.error(stderr);
        throw new Error('Error saving progress to Git');
    }
    logger_1.default(['save with commit & continue stdout', stdout]);
}
exports.saveCommit = saveCommit;
async function clear() {
    try {
        const { stderr } = await node_1.exec({ command: 'git reset HEAD --hard && git clean -fd' });
        if (!stderr) {
            return;
        }
        console.error(stderr);
    }
    catch (error) {
        console.error(error);
    }
    throw new Error('Error cleaning up current unsaved work');
}
exports.clear = clear;
async function init() {
    const { stderr } = await node_1.exec({ command: 'git init' });
    if (stderr) {
        throw new Error('Error initializing Git');
    }
}
async function initIfNotExists() {
    const hasGitInit = node_1.exists('.git');
    if (!hasGitInit) {
        await init();
    }
}
exports.initIfNotExists = initIfNotExists;
async function checkRemoteConnects(repo) {
    const externalRepoExists = await node_1.exec({ command: `git ls-remote --exit-code --heads ${repo.uri}` });
    if (externalRepoExists.stderr) {
        throw new Error(externalRepoExists.stderr);
    }
    const { stderr, stdout } = await node_1.exec({ command: `git ls-remote --exit-code --heads ${repo.uri} ${repo.branch}` });
    if (stderr) {
        throw new Error(stderr);
    }
    if (!stdout || !stdout.length) {
        throw new Error('Tutorial branch does not exist');
    }
}
exports.checkRemoteConnects = checkRemoteConnects;
async function addRemote(repo) {
    const { stderr } = await node_1.exec({ command: `git remote add ${exports.gitOrigin} ${repo} && git fetch ${exports.gitOrigin}` });
    if (stderr) {
        const alreadyExists = stderr.match(`${exports.gitOrigin} already exists.`);
        const successfulNewBranch = stderr.match('new branch');
        if (!alreadyExists && !successfulNewBranch) {
            console.error(stderr);
            throw new Error('Error adding git remote');
        }
    }
}
exports.addRemote = addRemote;
async function checkRemoteExists() {
    try {
        const { stdout, stderr } = await node_1.exec({ command: 'git remote -v' });
        if (stderr) {
            return false;
        }
        return !!stdout.match(exports.gitOrigin);
    }
    catch (error) {
        return false;
    }
}
exports.checkRemoteExists = checkRemoteExists;
async function setupCodeRoadRemote(repo) {
    const hasRemote = await checkRemoteExists();
    if (hasRemote) {
        return;
    }
    await addRemote(repo);
}
exports.setupCodeRoadRemote = setupCodeRoadRemote;
async function loadCommitHistory() {
    try {
        const { stdout, stderr } = await node_1.exec({ command: 'git log --pretty=format:"%h"' });
        if (stderr) {
            return [];
        }
        return stdout.split('\n');
    }
    catch (error) {
        return [];
    }
}
exports.loadCommitHistory = loadCommitHistory;
function getShortHash(hash) {
    return hash.slice(0, 7);
}
exports.getShortHash = getShortHash;
async function getCommitMessage(hash) {
    try {
        const { stdout, stderr } = await node_1.exec({ command: `git log -n 1 --pretty=format:%s ${hash}` });
        if (stderr) {
            return null;
        }
        return stdout;
    }
    catch (error) {
        logger_1.default('error', error);
        return null;
    }
}
exports.getCommitMessage = getCommitMessage;
async function commitsExistsByMessage(message) {
    try {
        const { stdout, stderr } = await node_1.exec({ command: `git log -g --grep='${message}'` });
        if (stderr) {
            return false;
        }
        return !!stdout.length;
    }
    catch (error) {
        logger_1.default('error', error);
        return false;
    }
}
exports.commitsExistsByMessage = commitsExistsByMessage;
async function validateGitConfig(target) {
    try {
        const { stdout, stderr } = await node_1.exec({ command: `git config ${target}` });
        if (stderr) {
            return false;
        }
        return !!stdout.length;
    }
    catch (error) {
        return false;
    }
}
exports.validateGitConfig = validateGitConfig;
//# sourceMappingURL=index.js.map