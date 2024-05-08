/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
const config = {
	preset: "ts-jest",
	modulePathIgnorePatterns: ["\\.spec\\."],

	collectCoverage: true,
	coverageProvider: "v8",
	coverageDirectory: ".coverage",
	coveragePathIgnorePatterns: ["/node_modules/"],
};

export default config;
