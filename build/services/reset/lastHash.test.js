"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lastHash_1 = require("./lastHash");
describe('lastHash', () => {
    it('should grab the last passing hash from a step', () => {
        const position = { levelId: '1', stepId: '1.2', complete: false };
        const tutorial = {
            levels: [
                {
                    id: '1',
                    title: '',
                    summary: '',
                    content: '',
                    steps: [
                        {
                            id: '1.1',
                            content: '',
                            setup: { commits: ['abcdef1'] },
                        },
                        {
                            id: '1.2',
                            content: '',
                            setup: { commits: ['abcdef2'] },
                        },
                    ],
                },
            ],
        };
        const result = lastHash_1.default(position, tutorial);
        expect(result).toBe('abcdef2');
    });
    it('should grab the last passing hash from a step with several commits', () => {
        const position = { levelId: '1', stepId: '1.2', complete: false };
        const tutorial = {
            levels: [
                {
                    id: '1',
                    title: '',
                    summary: '',
                    content: '',
                    steps: [
                        {
                            id: '1.1',
                            content: '',
                            setup: { commits: ['abcdef1'] },
                        },
                        {
                            id: '1.2',
                            content: '',
                            setup: { commits: ['abcdef2', 'abcdef3'] },
                        },
                    ],
                },
            ],
        };
        const result = lastHash_1.default(position, tutorial);
        expect(result).toBe('abcdef3');
    });
    it('should grab the last passing hash when level has no steps', () => {
        const position = { levelId: '1', stepId: null, complete: false };
        const tutorial = {
            config: {
                testRunner: {},
                setup: {
                    commits: ['abcdef2', 'abcdef3'],
                },
            },
            levels: [
                {
                    id: '1',
                    title: '',
                    summary: '',
                    content: '',
                    steps: [],
                },
            ],
        };
        const result = lastHash_1.default(position, tutorial);
        expect(result).toBe('abcdef3');
    });
});
//# sourceMappingURL=lastHash.test.js.map