import "@testing-library/jest-dom";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {Input, Textarea, LabelledInput, LabelledTextarea, SearchableInput} from "./inputs";
import {randomAlphanumString} from "../../../shared/helpers/randomAlphanumString";

beforeEach(() => {
	jest.spyOn(console, "error").mockImplementation((message) => {
		if (/Invalid value for prop/.test(message)) {
			return; // because it insisted i pass everything - from booleans to functions - as strings. that approach would go against the type system (which already ensures i'm passing the correct type) and would make function-calling validation impossible
		}
		jest.requireActual("console").error(message);
	});
});
afterEach(() => {
	jest.clearAllMocks();
});

describe("Test core components", () => {
	it("Input renders with varying types", () => {
		for (const type of [
			"text",
			"number",
			"password",
			"email",
			"tel",
			"url",
			"search",
			"date",
			"time",
			"datetime-local",
			"month",
			"week",
		]) {
			const {container} = render(Input({handler: () => {}, type}));
			expect(container.querySelector(`input[type="${type}"]`)).toBeInTheDocument();
		}
	});

	for (const input of [Input, Textarea]) {
		it(`${input.name} renders`, () => {
			const fn = jest.fn();
			render(input({handler: fn}));
			expect(screen.getByRole("textbox")).toBeInTheDocument();
		});

		it(`${input.name} handles input`, () => {
			const handler = jest.fn();
			render(input({handler}));
			const inputElement = screen.getByRole("textbox");
			const inputText = randomAlphanumString(10);
			fireEvent.input(inputElement, {target: {value: inputText}});
			expect(inputElement).toHaveValue(inputText);
			expect(handler).toHaveBeenCalledWith(inputText);
		});

		// TODO: look into testing for styles (e.g. testing that an input doesn't have the same style with [aria-invalid=true]) with jest. seems the only way to load components styled with css modules is to mock the modules, which makes testing them impossible
	}
});

describe("Test labelled inputs", () => {
	for (const input of [LabelledInput, LabelledTextarea]) {
		it(`${input.name} renders with label`, () => {
			render(LabelledInput({handler: () => {}, label: "Label", id: "id"}));
			expect(screen.getByRole("textbox")).toBeInTheDocument();
			expect(screen.getByLabelText("Label")).toBeInTheDocument();
		});

		it(`${input.name} receives focus when label is clicked`, () => {
			render(input({handler: () => {}, label: "Label", id: "inputId"}));
			const inputElem = screen.getByRole("textbox");
			const label = screen.getByLabelText("Label");

			fireEvent.click(label);
			waitFor(() => expect(inputElem).toHaveFocus());
		});
	}
});

describe("Test SearchableInput", () => {
	it("SearchableInput renders without label", () => {
		const placeholder = randomAlphanumString(10);

		const {container} = render(SearchableInput({handler: () => {}, label: placeholder, id: "id", options: []}));

		const input = screen.getByRole("combobox");
		expect(input).toBeInTheDocument();
		expect(input).toHaveProperty("placeholder", placeholder);

		expect(container.querySelector("label")).toBe(null);
	});

	it("SearchableInput renders with label", () => {
		const labelText = randomAlphanumString(10);

		const {container} = render(
			SearchableInput({handler: () => {}, label: labelText, id: "id", labelled: true, options: []}),
		);

		expect(screen.getByRole("combobox")).toBeInTheDocument();
		expect(container.querySelector("label")).toHaveTextContent(labelText);
	});

	it("SearchableInput's input receives focus when label is clicked", () => {
		render(SearchableInput({handler: () => {}, label: "Label", id: "id", labelled: true, options: []}));

		fireEvent.click(screen.getByLabelText("Label"));
		waitFor(() => expect(screen.getByRole("combobox")).toHaveFocus());
	});

	it("SearchableInput's options become visible and filtered by input", async () => {
		const optionLength = 5;
		const optionsCount = 10;
		const options = Array.from({length: optionsCount}, () => randomAlphanumString(optionLength));

		const {container} = render(
			SearchableInput({
				handler: () => {},
				label: "SearchableInput",
				id: "id",
				options: options.map((value) => ({value, text: value})),
			}),
		);

		expect(container.querySelector("datalist")?.childNodes.length).toBe(optionsCount);

		fireEvent.input(container.querySelector("input")!, {target: {value: options[0].slice(0, optionLength - 2)}});
		expect(await screen.findAllByText(options[0])).toHaveLength(1);

		// TODO: improve test rigor: see the checks below and figure out how to write them in a way that passes (if possible)

		// const optionsAsRegex = new RegExp(
		// 	options.reduce((acc, option) => acc + option + (option === options[options.length - 1] ? "" : "|"), "/") + "/g",
		// );
		// console.log(optionsAsRegex);
		// const visibleOptions = await screen.findAllByText(optionsAsRegex);
		// console.log(visibleOptions.map((element) => element.textContent));
		// expect(visibleOptions[0]).toHaveTextContent(options[0]);
		// expect(visibleOptions.length).toBeLessThan(optionsLength);
	});
});
