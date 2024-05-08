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

	collectCoverage: true,
	coverageProvider: "v8",
	coverageDirectory: ".coverage",
	coveragePathIgnorePatterns: ["/node_modules/"],
};

export default config;
