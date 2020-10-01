"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsdom_1 = require("jsdom");
const path = require("path");
const vscode = require("vscode");
const telemetry_1 = require("../telemetry");
const getNonce = () => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
async function render(panel, rootPath) {
    try {
        const dom = await jsdom_1.JSDOM.fromFile(path.join(rootPath, 'index.html'));
        const { document } = dom.window;
        const base = document.createElement('base');
        base.href = `${vscode.Uri.file(path.join(rootPath, 'build')).with({ scheme: 'vscode-resource' })}`;
        document.head.appendChild(base);
        const nonces = [];
        const createUri = (_filePath) => {
            const filePath = (_filePath.startsWith('vscode') ? _filePath.substr(16) : _filePath).replace('///', '\\');
            return panel.webview.asWebviewUri(vscode.Uri.file(path.join(rootPath, filePath)));
        };
        const scripts = Array.from(document.getElementsByTagName('script'));
        for (const script of scripts) {
            if (script.src) {
                const nonce = getNonce();
                nonces.push(nonce);
                script.nonce = nonce;
                script.src = createUri(script.src);
            }
        }
        const runTimeScript = document.createElement('script');
        runTimeScript.nonce = getNonce();
        nonces.push(runTimeScript.nonce);
        const manifest = await Promise.resolve().then(() => require(path.join(rootPath, 'asset-manifest.json')));
        runTimeScript.src = createUri(manifest.files['runtime-main.js']);
        document.body.appendChild(runTimeScript);
        const styles = Array.from(document.getElementsByTagName('link'));
        for (const style of styles) {
            if (style.href) {
                style.href = createUri(style.href);
            }
        }
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = 'Content-Security-Policy';
        cspMeta.content =
            [
                `default-src 'self'`,
                `connect-src https: http:`,
                `font-src ${panel.webview.cspSource} http: https: data:`,
                `img-src ${panel.webview.cspSource} https:`,
                `script-src ${nonces.map((nonce) => `'nonce-${nonce}'`).join(' ')} data:`,
                `style-src ${panel.webview.cspSource} https: 'self' 'unsafe-inline'`,
            ].join('; ') + ';';
        document.head.appendChild(cspMeta);
        const html = dom.serialize();
        panel.webview.html = html;
    }
    catch (error) {
        telemetry_1.onError(error);
        console.error(error);
    }
}
exports.default = render;
//# sourceMappingURL=render.js.map