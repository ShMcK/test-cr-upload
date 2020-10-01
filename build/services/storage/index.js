"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Storage {
    constructor({ key, storage, defaultValue }) {
        this.get = async () => {
            const value = await this.storage.get(this.key);
            if (value) {
                return JSON.parse(value);
            }
            return this.defaultValue;
        };
        this.set = (value) => {
            const stringValue = JSON.stringify(value);
            this.storage.update(this.key, stringValue);
        };
        this.update = async (value) => {
            const current = await this.get();
            const next = JSON.stringify({
                ...current,
                ...value,
            });
            this.storage.update(this.key, next);
        };
        this.reset = () => {
            this.set(this.defaultValue);
        };
        this.storage = storage;
        this.key = key;
        this.defaultValue = defaultValue;
    }
}
exports.default = Storage;
//# sourceMappingURL=index.js.map