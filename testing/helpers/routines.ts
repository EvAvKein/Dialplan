import {type Page, expect} from "@playwright/test";

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
