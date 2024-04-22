import {type FetchResponse} from "../../shared/objects/api";
import {type Invite, type InviteCreationRequest} from "../../shared/objects/inv";
import {expect, test} from "@playwright/test";
import {datasetLength, inviteData} from "../helpers/testData";
import {testInvalidBodyResponse, testInputInvalidAndValid} from "../helpers/routines";
import {signUp} from "../helpers/requestsByApi";

test.describe("Invites", () => {
	test.describe("API", () => {
		for (let i = 0; i < datasetLength; i++) {
			test(`Invalid invite creation (data i-${i})`, async ({page}) => {
				const context = page.context();

				await signUp(context.request);

				const response = await context.request.post("/api/invites", {
					data: {
						recipient: {
							name: inviteData.recipient.name.invalid[i],
							phone: {
								countryCode: inviteData.recipient.phone.countryCode.invalid[i],
								number: inviteData.recipient.phone.number.invalid[i],
							},
						},
						secCallDuration: inviteData.secCallDuration.invalid[i],
						expiry: inviteData.expiry.invalid[i],
						notes: {
							forRecipient: inviteData.notes.forRecipient?.invalid[i],
							forOrg: inviteData.notes.forOrg?.invalid[i],
						},
					} satisfies InviteCreationRequest,
				});

				await testInvalidBodyResponse(response, i ? 7 : 5); // conditional because first has empty notes which are optional

				const invitesResponse = await page.request.get("/api/invites");
				const invites = ((await invitesResponse.json()) as FetchResponse<Invite[]>).data;
				expect(invites?.length).toBe(0);
			});

			test(`Valid invite creation (data i-${i})`, async ({page}) => {
				const context = page.context();

				await signUp(context.request);

				const response = await context.request.post("/api/invites", {
					data: {
						recipient: {
							name: inviteData.recipient.name.valid[i],
							phone: {
								countryCode: inviteData.recipient.phone.countryCode.valid[i],
								number: inviteData.recipient.phone.number.valid[i],
							},
						},
						secCallDuration: inviteData.secCallDuration.valid[i],
						expiry: inviteData.expiry.valid[i],
						notes: {
							forRecipient: inviteData.notes.forRecipient?.valid[i],
							forOrg: inviteData.notes.forOrg?.valid[i],
						},
					} satisfies InviteCreationRequest,
				});

				expect(response).toBeOK();

				const invitesResponse = await page.request.get("/api/invites");
				const invites = ((await invitesResponse.json()) as FetchResponse<Invite[]>).data;
				expect(invites?.length).toBe(1);
			});
		}
	});

	test.describe("UI", () => {
		test.beforeEach(async ({page}) => {
			await signUp(page.context().request);
			await page.goto("/dashboard/invites");
			await page.getByTestId("openInviteCreationForm").click();
		});

		for (let i = 0; i < 2; i++) {
			// not interating until datasetLength because:
			// 1. the latter two invalid number values are also invalid inputs
			// 2. i'm about to start restructuring tests in a way that that'd make iterating through all the invalid data in the E2E unnecessary
			test(`Invite creation interface (data i-${i})`, async ({page}) => {
				async function failInviteSubmit() {
					const errorCount = await page.getByTestId("notifNegative").count();
					await page.getByTestId("newInviteSubmit").click();
					const newErrorCount = await page.getByTestId("notifNegative").count();
					expect(newErrorCount).toBe(errorCount + 1);
					await expect(page.getByTestId("newInviteSubmit")).toBeVisible();
				}

				await testInputInvalidAndValid(
					page,
					"newRecipientName",
					inviteData.recipient.name.invalid[i],
					inviteData.recipient.name.valid[i],
					failInviteSubmit,
				);

				await testInputInvalidAndValid(
					page,
					"newCountryCode",
					inviteData.recipient.phone.countryCode.invalid[i],
					inviteData.recipient.phone.countryCode.valid[i],
					failInviteSubmit,
				);

				await testInputInvalidAndValid(
					page,
					"newPhoneNumber",
					inviteData.recipient.phone.number.invalid[i],
					inviteData.recipient.phone.number.valid[i],
					failInviteSubmit,
				);

				await testInputInvalidAndValid(
					page,
					"newCallDuration",
					inviteData.secCallDuration.invalid[i].toString(),
					inviteData.secCallDuration.valid[i].toString(),
					failInviteSubmit,
				);

				await page.getByTestId("newExpiry").fill(inviteData.expiry.valid[i].replace(":00Z", "")); // cant fill this input type as invalid

				if (i) {
					// optional fields, so also testing lack of input
					await testInputInvalidAndValid(
						page,
						"newNotesForRecipient",
						inviteData.notes.forRecipient!.invalid[i]!,
						inviteData.notes.forRecipient!.valid[i]!,
					);

					await testInputInvalidAndValid(
						page,
						"newNotesForOrg",
						inviteData.notes.forOrg!.invalid[i]!,
						inviteData.notes.forOrg!.valid[i]!,
					);
				}

				await page.getByTestId("newInviteSubmit").click();

				await expect(page.getByTestId("notifPositive")).toBeVisible();
				const newRow = page.getByTestId("invitesTable").locator("tr:nth-child(2)");

				async function validateNewRow() {
					// TODO: more thorough validation once settled on design
					await expect(newRow.locator("> :nth-child(2)")).toContainText(inviteData.recipient.name.valid[i]);
					await expect(newRow.locator("> :nth-child(3)")).toContainText(inviteData.recipient.phone.number.valid[i]);
					// omitting secCallDuration test pending upcoming project-wide test refactors
					expect(new Date(await newRow.locator("> :nth-child(5)").innerText()).toLocaleString()).toBe(
						// doing conversion of innerText because the locales are somehow different between the test runner and the tests' browser
						new Date(inviteData.expiry.valid[i]).toLocaleString(),
					);
				}

				await validateNewRow();
				await page.reload();
				await validateNewRow();
			});
		}
	});
});
