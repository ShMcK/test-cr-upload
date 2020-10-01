"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
describe('parser', () => {
    describe('mocha', () => {
        test('should pass single success', () => {
            const example = `
1..1
ok 1 - Should pass
`;
            expect(parser_1.default(example)).toEqual({
                ok: true,
                passed: [{ message: 'Should pass' }],
                failed: [],
                logs: [],
                summary: { 'Should pass': true },
            });
        });
        test('should detect multiple successes', () => {
            const example = `
1..2
ok 1 - Should pass
ok 2 - Should also pass
`;
            const result = parser_1.default(example);
            expect(result).toEqual({
                ok: true,
                passed: [{ message: 'Should pass' }, { message: 'Should also pass' }],
                failed: [],
                logs: [],
                summary: {
                    'Should pass': true,
                    'Should also pass': true,
                },
            });
        });
        test('should detect failure if no tests passed', () => {
            const example = `
# Starting...
# 1 test suites found.

#  FAIL  __tests__/sum.test.js

not ok 1 ● sum › should add two numbers together
`;
            expect(parser_1.default(example).ok).toBe(false);
        });
        test('should detect single failure among successes', () => {
            const example = `
1..3
ok 1 - Should pass
not ok 2 - This one fails
ok 3 - Also passes
`;
            expect(parser_1.default(example).ok).toBe(false);
        });
        test('should return failure message', () => {
            const example = `
1..4
ok 1 - Should pass
not ok 2 - First to fail
ok 3 - Also passes
not ok 4 - Second to fail
`;
            expect(parser_1.default(example).failed).toEqual([{ message: 'First to fail' }, { message: 'Second to fail' }]);
        });
        test('should parse mocha tap example', () => {
            const example = `
1..3
ok 1 itemList data should not be changed
ok 2 sumItems shouldn't return NaN
ok 3 sumItems should total numbers accurately
# tests 3
# pass 3
# fail 0
# skip 0
`;
            expect(parser_1.default(example).ok).toBe(true);
        });
        test('should return failure message for mocha tap example', () => {
            const example = `
1..3
ok 1 itemList data should not be changed
not ok 2 sumItems shouldn't return NaN
ok 3 sumItems should total numbers accurately
# tests 3
# pass 2
# fail 1
# skip 0
`;
            expect(parser_1.default(example).failed).toEqual([{ message: "sumItems shouldn't return NaN" }]);
        });
        test('should capture single error details', () => {
            const example = `
not ok 1 package.json should have a valid "author" key
#  AssertionError [ERR_ASSERTION]: no "author" key provided
#      at Context.<anonymous> (test/packagejson.test.js:11:12)
#      at processImmediate (internal/timers.js:439:21)
# tests 1
# pass 0
# fail 1
# skip 0
`;
            const result = parser_1.default(example);
            expect(result.failed[0].message).toBe('package.json should have a valid "author" key');
            expect(result.failed[0].details).toBe(`AssertionError [ERR_ASSERTION]: no "author" key provided
at Context.<anonymous> (test/packagejson.test.js:11:12)
at processImmediate (internal/timers.js:439:21)`);
        });
        test('should capture multiple error details', () => {
            const example = `
not ok 1 package.json should have a valid "author" key
#  AssertionError [ERR_ASSERTION]: no "author" key provided
#      at Context.<anonymous> (test/packagejson.test.js:11:12)
#      at processImmediate (internal/timers.js:439:21)
not ok 2 package.json should have a valid "description" key
#  AssertionError [ERR_ASSERTION]: no "description" key provided
# tests 1
# pass 0
# fail 1
# skip 0
`;
            const result = parser_1.default(example);
            expect(result.failed[0].message).toBe('package.json should have a valid "author" key');
            expect(result.failed[0].details).toBe(`AssertionError [ERR_ASSERTION]: no "author" key provided
at Context.<anonymous> (test/packagejson.test.js:11:12)
at processImmediate (internal/timers.js:439:21)`);
            expect(result.failed[1].message).toBe('package.json should have a valid "description" key');
            expect(result.failed[1].details).toBe(`AssertionError [ERR_ASSERTION]: no "description" key provided`);
        });
        test('should capture multiple error details between successes', () => {
            const example = `
ok 1 first passing test
not ok 2 package.json should have a valid "author" key
#  AssertionError [ERR_ASSERTION]: no "author" key provided
#      at Context.<anonymous> (test/packagejson.test.js:11:12)
#      at processImmediate (internal/timers.js:439:21)
ok 3 some passing test
not ok 4 package.json should have a valid "description" key
#  AssertionError [ERR_ASSERTION]: no "description" key provided
ok 5 some passing test
# tests 1
# pass 0
# fail 1
# skip 0
`;
            const result = parser_1.default(example);
            expect(result.failed[0].message).toBe('package.json should have a valid "author" key');
            expect(result.failed[0].details).toBe(`AssertionError [ERR_ASSERTION]: no "author" key provided
at Context.<anonymous> (test/packagejson.test.js:11:12)
at processImmediate (internal/timers.js:439:21)`);
            expect(result.failed[1].message).toBe('package.json should have a valid "description" key');
            expect(result.failed[1].details).toBe(`AssertionError [ERR_ASSERTION]: no "description" key provided`);
        });
        test('should capture logs', () => {
            const example = `
1..2
ok 1 package.json should have "express" installed
log 1
log 2
not ok 2 server should log "Hello World"
#  AssertionError [ERR_ASSERTION]: "Hello World was not logged
#      at Context.<anonymous> (test/server.test.js:15:12)
#      at processImmediate (internal/timers.js:439:21)
# tests 2
# pass 1
# fail 1
# skip 0
`;
            expect(parser_1.default(example)).toEqual({
                ok: false,
                passed: [{ message: 'package.json should have "express" installed' }],
                failed: [
                    {
                        message: 'server should log "Hello World"',
                        details: `AssertionError [ERR_ASSERTION]: \"Hello World was not logged
at Context.<anonymous> (test/server.test.js:15:12)
at processImmediate (internal/timers.js:439:21)`,
                        logs: ['log 1', 'log 2'],
                    },
                ],
                logs: ['log 1', 'log 2'],
                summary: {
                    'package.json should have "express" installed': true,
                    'server should log "Hello World"': false,
                },
            });
        });
    });
    describe('tap.py', () => {
        test('should pass with success messages', () => {
            const example = `
# TAP results for MathTest
ok 1 test_add_no_numbers (tests.math_test.MathTest)
ok 2 test_add_one_number (tests.math_test.MathTest)
ok 3 test_add_three_numbers (tests.math_test.MathTest)
ok 4 test_add_two_numbers (tests.math_test.MathTest)
1..4
`;
            expect(parser_1.default(example)).toEqual({
                ok: true,
                passed: [
                    { message: 'add no numbers' },
                    { message: 'add one number' },
                    { message: 'add three numbers' },
                    { message: 'add two numbers' },
                ],
                failed: [],
                logs: [],
                summary: {
                    'add no numbers': true,
                    'add one number': true,
                    'add three numbers': true,
                    'add two numbers': true,
                },
            });
        });
        test('should handle fail messages', () => {
            const example = `
# TAP results for MathTest
not ok 1 test_add_no_numbers (tests.math_test.MathTest)
# Traceback (most recent call last):
#   Fail Message
# AssertionError: 42 != 0 : Should return 0 with no params
1..1`;
            expect(parser_1.default(example)).toEqual({
                ok: false,
                passed: [],
                failed: [
                    {
                        message: 'add no numbers',
                        details: 'Traceback (most recent call last):\nFail Message\nAssertionError: 42 != 0 : Should return 0 with no params',
                    },
                ],
                logs: [],
                summary: {
                    'add no numbers': false,
                },
            });
        });
        test('should handle both success and fail messages', () => {
            const example = `
# TAP results for MathTest
ok 1 test_add_no_numbers (tests.math_test.MathTest)
not ok 2 test_add_one_number (tests.math_test.MathTest)
# Traceback (most recent call last):
#   Fail Message
# AssertionError: 2 != 1 : Should add one number to 0
1..2
`;
            expect(parser_1.default(example)).toEqual({
                ok: false,
                passed: [{ message: 'add no numbers' }],
                failed: [
                    {
                        message: 'add one number',
                        details: 'Traceback (most recent call last):\nFail Message\nAssertionError: 2 != 1 : Should add one number to 0',
                    },
                ],
                logs: [],
                summary: {
                    'add no numbers': true,
                    'add one number': false,
                },
            });
        });
    });
});
describe('subtasks', () => {
    it('should parse subtasks', () => {
        const summary = {
            'SUBTASKS 1.1 :1 should add one number': true,
            'SUBTASKS 1.1 :2 should add two numbers': false,
            'SUBTASKS 1.1 :3 should add three numbers': false,
        };
        const subtaskRegex = /^SUBTASKS\s(?<stepId>(\d+\.\d+))\s:(?<testId>\d+)\s/;
        const subtaskSummary = {};
        Object.keys(summary).forEach((key) => {
            const match = key.match(subtaskRegex);
            if (!!match) {
                const { stepId, testId } = match.groups || {};
                const testIndex = Number(testId) - 1;
                subtaskSummary[testIndex] = summary[key];
            }
        });
        expect(subtaskSummary).toEqual({
            0: true,
            1: false,
            2: false,
        });
    });
});
//# sourceMappingURL=parser.test.js.map