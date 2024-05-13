/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
const config = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	modulePathIgnorePatterns: ["\\.spec\\."],
	extensionsToTreatAsEsm: [".ts"], // used by the moduleNameMapper config property
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1", // ts modules aren't detected without this. copied from: https://stackoverflow.com/a/69598249
		"\\.css$": "<rootDir>/frontend/src/mocks/cssModule.ts",
		"\\.css\\?raw$": "<rootDir>/frontend/src/mocks/cssModule_raw.ts",
	},

	collectCoverage: true,
	coverageProvider: "v8",
	coverageDirectory: ".coverage",
	coverageReporters: ["json-summary", "json", "text-summary"],
	coveragePathIgnorePatterns: ["/node_modules/"],
};

export default config;
