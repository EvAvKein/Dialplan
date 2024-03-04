/**
 * @type {{import("ts-jest").InitialOptionsWithTsJest}}
 */
const config = {
	preset: "ts-jest",
	extensionsToTreatAsEsm: [".ts"], // used by the moduleNameMapper config property
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1", // ts modules aren't detected without this. copied from: https://stackoverflow.com/a/69598249
	},
};

export default config;
