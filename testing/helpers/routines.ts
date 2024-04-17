import {type Page, type APIResponse, expect} from "@playwright/test";
import {type FetchResponse} from "../../shared/objects/api";

export async function testInputInvalidAndValid(
	page: Page,
	testId: string,
	invalidValue: string,
	validValue: string,
	funcAfterInvalidBeforeValid?: (page: Page) => Promise<void>,
) {
	await page.getByTestId(testId).fill(invalidValue);
	await expect(page.getByTestId(testId)).toHaveAttribute("aria-invalid", "true");
	if (funcAfterInvalidBeforeValid) await funcAfterInvalidBeforeValid(page);
	await page.getByTestId(testId).fill(validValue);
	await expect(page.getByTestId(testId)).toHaveAttribute("aria-invalid", "false");
}

export async function testInvalidBodyResponse(response: APIResponse, invalidProperties: number) {
	await expect(response).not.toBeOK();
	const body: FetchResponse = await response.json();
	expect((body.error?.message.match(/Invalid|Expected/g) ?? []).length).toBe(invalidProperties);
}
