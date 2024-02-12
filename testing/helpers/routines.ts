import {type Page, type APIResponse, expect} from "@playwright/test";
import {type FetchResponse} from "../../shared/objects/api";

export async function testInputInvalidAndValid(
	page: Page,
	testId: string,
	invalidValue: string,
	navTest: (page: Page) => Promise<void>,
	validValue: string,
) {
	await page.getByTestId(testId).fill(invalidValue);
	await expect(page.getByTestId(testId)).toHaveAttribute("aria-invalid", "true");
	await navTest(page);
	await page.getByTestId(testId).fill(validValue);
	await expect(page.getByTestId(testId)).toHaveAttribute("aria-invalid", "false");
}

export async function testInvalidBodyResponse(response: APIResponse, invalidProperties: number) {
	expect(response).not.toBeOK();
	const body: FetchResponse = await response.json();
	expect((body.error?.message.match(/Invalid/g) ?? []).length).toBe(invalidProperties);
}
