/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
const config = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	moduleNameMapper: {
		"\\.css$": "<rootDir>/src/mocks/cssModule.ts",
		"\\.css\\?raw$": "<rootDir>/src/mocks/cssModule_raw.ts",
	},
};

export default config;
