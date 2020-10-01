"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const render_1 = require("./render");
const state = { loaded: false };
const createReactWebView = ({ extensionPath, channel }) => {
    const disposables = [];
    function createWebViewPanel() {
        const viewType = 'CodeRoad';
        const title = 'CodeRoad';
        const config = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'build'))],
            retainContextWhenHidden: true,
            enableCommandUris: true,
        };
        state.loaded = true;
        return vscode.window.createWebviewPanel(viewType, title, vscode.ViewColumn.Two, config);
    }
    let panel = createWebViewPanel();
    panel.onDidDispose(() => {
        panel.dispose();
        state.loaded = false;
    }, null, disposables);
    const receive = channel.receive;
    const send = (action) => panel.webview.postMessage(action);
    panel.webview.onDidReceiveMessage(receive, null, disposables);
    const rootPath = path.join(extensionPath, 'build');
    render_1.default(panel, rootPath);
    return {
        state,
        createOrShow() {
            vscode.commands.executeCommand('vscode.setEditorLayout', {
                orientation: 0,
                groups: [{ size: 0.6 }, { size: 0.4 }],
            });
            if (panel && panel.webview) {
                vscode.window.showInformationMessage('CodeRoad already open');
                panel.reveal(vscode.ViewColumn.Two);
            }
            else {
                panel = createWebViewPanel();
            }
        },
        send,
        receive,
    };
};
exports.default = createReactWebView;
//# sourceMappingURL=index.js.map