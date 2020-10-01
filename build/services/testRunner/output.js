"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOutput = exports.showOutput = exports.addOutput = void 0;
const vscode = require("vscode");
const channels = {};
const getOutputChannel = (name) => {
    if (!channels[name]) {
        channels[name] = vscode.window.createOutputChannel(name);
    }
    return channels[name];
};
exports.addOutput = (params) => {
    const channel = getOutputChannel(params.channel);
    channel.clear();
    channel.append(params.text);
};
exports.showOutput = (channelName) => {
    const channel = getOutputChannel(channelName);
    channel.show();
};
exports.clearOutput = (channelName) => {
    const channel = getOutputChannel(channelName);
    channel.clear();
    channel.hide();
};
//# sourceMappingURL=output.js.map