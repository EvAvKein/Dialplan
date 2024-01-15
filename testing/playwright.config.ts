import type {PlaywrightTestConfig} from "@playwright/test";
import {devices} from "@playwright/test";

const config: PlaywrightTestConfig = {
	testDir: "./tests",
	// testMatch: [],

	expect: {timeout: 5 * 1000},

	use: {
		baseURL: "http://localhost:80",
		trace: "on",
		// launchOptions: {slowMo: 500},
	},

	reporter: [[process.env.CI ? "github" : "list"], ["html", {open: "never"}]],

	retries: process.env.CI ? 1 : 0,

	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
			},
		},

		// commented-out to reduce test execution time (TODO: uncomment when nearing release-worthy state)
		// {
		// 	name: "firefox",
		// 	use: {
		// 		...devices["Desktop Firefox"],
		// 	},
		// },
		// {
		// 	name: "webkit",
		// 	use: {
		// 		...devices["Desktop Safari"],
		// 	},
		// },
	],

	outputDir: "test-results/",
};

export default config;
