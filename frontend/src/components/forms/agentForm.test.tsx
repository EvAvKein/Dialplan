import {render, screen, fireEvent} from "@testing-library/react";
import {AgentForm} from "./agentForm";
import {InputState} from "../../helpers/inputState";

describe("AgentForm", () => {
	it("Render all input fields", () => {
		render(
			<AgentForm
				formState={{
					name: new InputState("", new RegExp(".*")),
					department: new InputState("", new RegExp(".*")),
					countryCode: new InputState("", new RegExp(".*")),
					timezone: new InputState("", new RegExp(".*")),
				}}
				setFormState={() => {}}
			/>,
		);
		expect(screen.getByLabelText("Name")).toBeTruthy();
		expect(screen.getByLabelText("Department")).toBeTruthy();
		expect(screen.getByLabelText("Country Code (Phone)")).toBeTruthy();
		expect(screen.getByLabelText("Timezone")).toBeTruthy();
	});

	it("Update form state when input values change", () => {
		const formState = {
			name: new InputState("", new RegExp(".*")),
			department: new InputState("", new RegExp(".*")),
			countryCode: new InputState("", new RegExp(".*")),
			timezone: new InputState("", new RegExp(".*")),
		};
		for (const key of Object.keys(formState)) {
			const originalSet = formState[key as keyof typeof formState].set;

			formState[key as keyof typeof formState].set = jest.fn().mockImplementation(originalSet);
		}
		const setFormState = jest.fn();

		function inputAndValidate(inputLabel: string, stateKey: keyof typeof formState, value: string) {
			const input = screen.getByLabelText(inputLabel);
			fireEvent.input(input, {target: {value}});
			expect(formState[stateKey].set).toHaveBeenCalledWith(value);
			expect(setFormState).toHaveBeenCalledWith(formState);
		}

		render(<AgentForm formState={formState} setFormState={setFormState} />);

		inputAndValidate("Name", "name", "John Doe");
		inputAndValidate("Department", "department", "Sales");
		inputAndValidate("Country Code (Phone)", "countryCode", "1");
		inputAndValidate("Timezone", "timezone", "America/New_York");

		for (const key of Object.keys(formState)) {
			expect(formState[key as keyof typeof formState].set).toHaveBeenCalledTimes(1);
		}
		expect(setFormState).toHaveBeenCalledTimes(Object.keys(formState).length);
	});
});
