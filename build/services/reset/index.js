"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../node");
const ignoreError = () => {
};
const reset = async ({ branch, hash }) => {
    const remote = 'coderoad';
    try {
        await node_1.exec({ command: 'git init' }).catch(console.log);
        const hasBranch = await node_1.exec({ command: 'git branch --show-current' });
        const localBranch = hasBranch.stdout;
        const hasRemote = await node_1.exec({ command: 'git remote -v' }).catch(console.warn);
        if (!hasRemote || !hasRemote.stdout || !hasRemote.stdout.length) {
            throw new Error('No remote found');
        }
        else if (!hasRemote.stdout.match(new RegExp(remote))) {
            throw new Error(`No "${remote}" remote found`);
        }
        await node_1.exec({
            command: 'git checkout --orphan reset-orphan-branch',
        });
        await node_1.exec({
            command: 'git stash',
        }).catch(ignoreError);
        await node_1.exec({
            command: 'git rm -rf .',
        }).catch(ignoreError);
        await node_1.removeFile('.gitignore').catch(ignoreError);
        await node_1.exec({
            command: `git branch -D ${localBranch}`,
        });
        await node_1.exec({
            command: `git checkout -b ${localBranch}`,
        });
        await node_1.exec({
            command: `git fetch coderoad ${branch}`,
        });
        await node_1.exec({
            command: `git merge coderoad/${branch}`,
        });
        await node_1.exec({
            command: `git reset --hard ${hash}`,
        });
    }
    catch (error) {
        console.error('Error resetting');
        console.error(error.message);
    }
};
exports.default = reset;
//# sourceMappingURL=index.js.map