/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
const config = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	moduleNameMapper: {
		"\\.css$": "<rootDir>/src/mocks/cssModule.ts",
	},
};

export default config;
