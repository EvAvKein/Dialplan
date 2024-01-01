import {Page, expect, test} from "@playwright/test";
import {type OrgAgentCreationDuo} from "../../shared/objects/org";
import {orgData, agentData} from "../helpers/testData";
import {type FetchResponse} from "../../shared/objects/api";

test.describe("Sign Up", async () => {
	test.describe("API", async () => {
		for (let i = 0; i < 4; i++) {
			test(`Invalid sign-up (data i-${i})`, async ({request, page}) => {
				await page.goto("/");

				const invalidData: OrgAgentCreationDuo = {
					org: {name: orgData.name.invalid[i], color: orgData.color.invalid[i], timezone: orgData.timezone.invalid[i]},
					agent: {
						name: agentData.name.invalid[i],
						department: agentData.department.invalid[i],
						countryCode: agentData.countryCode.invalid[i],
						internals: {permissions: {}},
					},
				};
				const response = await request.post("/api/orgs", {data: invalidData});

				expect(response.ok()).toBeFalsy();
				expect(response.headers()["set-cookie"]).toBeUndefined();
				const jsonContent: FetchResponse = await response.json();
				expect((jsonContent.error?.message.match(/Invalid/g) ?? []).length).toBe(6);
			});

			test(`Valid sign-up (data i-${i})`, async ({request, page}) => {
				await page.goto("/");

				const creationData: OrgAgentCreationDuo = {
					org: {name: orgData.name.valid[1], color: orgData.color.valid[1], timezone: orgData.timezone.valid[1]},
					agent: {
						name: agentData.name.valid[1],
						department: agentData.department.valid[1],
						countryCode: agentData.countryCode.valid[1],
						internals: {permissions: {}},
					},
				};
				const response1 = await request.post("/api/orgs", {data: creationData});

				expect(response1.ok()).toBeTruthy();
				expect(response1.headers()["set-cookie"]).toBeDefined();

				for (const response of [await request.get("/api/agents"), await request.get("/api/orgs")]) {
					expect(response.ok()).toBeTruthy();
					const jsonContent: FetchResponse = await response.json();
					expect(jsonContent.error).toBeFalsy();
				}
			});
		}
	});

	const pageData = {
		org: {
			title: "Organization Data",
			inputs: {
				name: "orgNameInput",
				color: "orgColorInput",
				timezone: "orgTimezoneInput",
			},
		},
		agent: {
			title: "Your Data",
			inputs: {
				name: "agentNameInput",
				department: "agentDepartmentInput",
				countryCode: "agentCountryCodeInput",
			},
		},
	} as const;
	type pageTitle = (typeof pageData)[keyof typeof pageData]["title"];

	const pageButtons = {prev: "prevSignUpPage", next: "nextSignUpPage", submit: "submitSignUp"} as const;

	async function validateCurrentPage(page: Page, currentPageTitle: pageTitle, thorough?: true) {
		for (const key in pageData) {
			const data = pageData[key as keyof typeof pageData];
			const shouldExist = data.title === currentPageTitle;

			expect(await page.locator("h3", {hasText: data.title}).count())[shouldExist ? "toBeTruthy" : "toBeFalsy"]();

			if (thorough) {
				for (const input in data.inputs) {
					expect(await page.getByTestId(data.inputs[input]).count())[shouldExist ? "toBeTruthy" : "toBeFalsy"]();
				}
			}
		}
	}

	async function validateButtonClick(
		page: Page,
		button: keyof typeof pageButtons,
		expectedSuccess: boolean,
		outcomePage: pageTitle,
		notifExpiryExpects: (() => Promise<unknown>)[],
	) {
		const notifsBeforeClick = await page.locator('[data-testid="notifNegative"]').count();
		await page.getByTestId(pageButtons[button]).click();

		if (!expectedSuccess) {
			const newNotif = await page.waitForSelector(`[data-testid="notifNegative"]:nth-child(${notifsBeforeClick + 1})`);
			const notifId = await newNotif.getAttribute("data-notifid");
			expect(notifId).toBeDefined();
			notifExpiryExpects.push(async () => {
				await page.waitForSelector(`[data-testid="notifsWrapper"]:not(:has([data-notifid="${notifId}"]))`);
			});
		}

		await validateCurrentPage(page, outcomePage);
	}

	async function testInputInvalidAndValid(
		page: Page,
		testId: string,
		invalidValue: string,
		navTest: (page: Page) => Promise<void>,
		validValue: string,
	) {
		const selector = `[data-testid="${testId}"]`;
		await expect(page.locator(selector + ":not(:user-invalid)")).toBeVisible();
		await page.locator(selector).fill(invalidValue);
		await page.locator(selector).blur();
		await expect(page.locator(selector + ":user-invalid")).toBeVisible();
		await navTest(page);
		await page.locator(selector).fill(validValue);
		await page.locator(selector).blur();
		await expect(page.locator(selector + ":not(:user-invalid)")).toBeVisible();
	}

	test.describe("UI", async () => {
		for (let i = 0; i < 4; i++) {
			test(`Sign-Up interface (data i-${i})`, async ({page}) => {
				const {org, agent} = pageData;
				const notifExpiryExpects: (() => Promise<unknown>)[] = [];

				await page.goto("/signUp");

				await validateCurrentPage(page, "Organization Data", true);
				await validateButtonClick(page, "next", false, "Organization Data", notifExpiryExpects);
				await validateCurrentPage(page, "Organization Data", true);

				orgData.name.invalid[i] // because one of them is empty, and filling an input with that doesn't trigger :user-invalid
					? await testInputInvalidAndValid(
							page,
							org.inputs.name,
							orgData.name.invalid[i],
							async () => validateButtonClick(page, "next", false, "Organization Data", notifExpiryExpects),
							orgData.name.valid[i],
					  )
					: await page.locator(`[data-testid="${org.inputs.name}"]`).fill(orgData.name.valid[i]);

				// skipping testing the color input because it's not possible to input invalid values (and attempts to do so with JS throw an error). TODO: look into this with various OSs
				await page.getByTestId(org.inputs.color).fill("#" + orgData.color.valid[i].toLowerCase());

				await testInputInvalidAndValid(
					page,
					org.inputs.timezone,
					orgData.timezone.invalid[i],
					async () => {},
					orgData.timezone.valid[i],
				);

				await validateButtonClick(page, "next", true, "Your Data", notifExpiryExpects);
				await validateButtonClick(page, "prev", true, "Organization Data", notifExpiryExpects);
				await expect(page.getByTestId(org.inputs.name)).toHaveValue(orgData.name.valid[i]);
				await expect(page.getByTestId(org.inputs.color)).toHaveValue("#" + orgData.color.valid[i].toLowerCase());
				await expect(page.getByTestId(org.inputs.timezone)).toHaveValue(orgData.timezone.valid[i]);
				await validateButtonClick(page, "next", true, "Your Data", notifExpiryExpects);

				await validateButtonClick(page, "prev", true, "Organization Data", notifExpiryExpects);
				await testInputInvalidAndValid(
					page,
					org.inputs.name,
					orgData.name.invalid[i],
					async () => validateButtonClick(page, "next", false, "Organization Data", notifExpiryExpects),
					orgData.name.valid[i],
				);
				await validateButtonClick(page, "next", true, "Your Data", notifExpiryExpects);

				agentData.name.invalid[i] // because one of them is empty, and filling an input with that doesn't trigger :user-invalid
					? await testInputInvalidAndValid(
							page,
							agent.inputs.name,
							agentData.name.invalid[i],
							async () => {},
							agentData.name.valid[i],
					  )
					: await page.locator(`[data-testid="${agent.inputs.name}"]`).fill(agentData.name.valid[i]);

				await testInputInvalidAndValid(
					page,
					agent.inputs.department,
					agentData.department.invalid[i],
					async () => validateButtonClick(page, "submit", false, "Your Data", notifExpiryExpects),
					agentData.department.valid[i],
				);

				agentData.countryCode.invalid[i].match(/a-z/) // because one of them contains a letter, and since the input is type="number" it trying to fill with that throws an error
					? await testInputInvalidAndValid(
							page,
							agent.inputs.countryCode,
							agentData.countryCode.invalid[i],
							async () => {},
							agentData.countryCode.valid[i],
					  )
					: await page.locator(`[data-testid="${agent.inputs.countryCode}"]`).fill(agentData.countryCode.valid[i]);

				await page.getByTestId(pageData.agent.inputs.name).fill("");
				await validateButtonClick(page, "submit", false, "Your Data", notifExpiryExpects);
				await page.getByTestId(pageData.agent.inputs.department).fill("");
				await validateButtonClick(page, "submit", false, "Your Data", notifExpiryExpects);
				await page.getByTestId(pageData.agent.inputs.name).fill(agentData.name.valid[i]);
				await validateButtonClick(page, "submit", false, "Your Data", notifExpiryExpects);
				await page.getByTestId(pageData.agent.inputs.department).fill(agentData.department.valid[i]);

				for (const expectNotifExpiry of notifExpiryExpects) {
					await expectNotifExpiry();
				}
				await expect(page.locator('[data-testid="notifNegative"]')).toHaveCount(0);

				const request = page.waitForResponse("/api/orgs");
				await page.getByTestId(pageButtons.submit).click();
				const response = await request;
				expect(response.ok()).toBeTruthy();
				const cookies = (await response.allHeaders())["set-cookie"];
				expect(cookies).toBeDefined(); // could be more specific, unsure what particular aspects are important without coupling to implementation
				await expect(page).toHaveURL(/.*dashboard/);
			});
		}
	});
});
