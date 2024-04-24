import "@testing-library/jest-dom";
import {render, screen, fireEvent, act} from "@testing-library/react";
import {InviteCard} from "./inviteCard";
import {secsToReadableDuration} from "../helpers/secsToReadableDuration";
import {CallCreationRequest} from "../../../shared/objects/inv";

describe("InviteCard", () => {
	const inv = {
		org: {
			name: "UniqueOrgName",
			color: "#FF0000",
			customInvCss: ".invCard { background-color: var(--orgColor); }",
			customInvCssOverrides: false,
		},
		agent: {
			department: "ImportantAgentDep",
			name: "TheAgentName",
		},
		message: "Hello recipient! We'd like to chat about [X], please select the most convenient time for you!",
		recipient: {
			name: "John Recipient",
			phone: {
				countryCode: "+1",
				number: "1234567890",
			},
		},
		secCallDuration: 9850,
		expiry: "2022-01-01T23:59:00Z",
		id: "n9c437nf8937hf",
	};

	it("Render InviteCard with correct data", () => {
		render(<InviteCard invite={inv} handler={() => {}} />);

		expect(screen.getByText(inv.org.name)).toBeTruthy();
		expect(screen.getByText(inv.agent.department)).toBeTruthy();
		expect(screen.getByText(inv.agent.name)).toBeTruthy();
		expect(screen.getByText(inv.recipient.name)).toBeTruthy();
		expect(screen.getByText(inv.recipient.phone.countryCode)).toBeTruthy();
		expect(screen.getByText(inv.recipient.phone.number)).toBeTruthy();
		expect(screen.getByText(secsToReadableDuration(inv.secCallDuration))).toBeTruthy();
		expect(screen.getByText(new Date(inv.expiry).toLocaleDateString())).toBeTruthy();
		expect(screen.getByText(inv.message)).toBeTruthy();
		expect(screen.getByText(inv.id)).toBeTruthy();
	});

	describe("Custom CSS", () => {
		it("Custom CSS is inserted alongside default styles", () => {
			const customCss = ".invCard { background-color: lightgreen; }";

			render(
				<InviteCard
					invite={{...inv, org: {...inv.org, customInvCss: customCss, customInvCssOverrides: false}}}
					handler={() => {}}
				/>,
			);

			const styleElems = document.querySelectorAll("style");
			expect(styleElems.length).toBe(2);

			const defaultStyle = styleElems[0].textContent;
			const customStyleElem = styleElems[1].textContent;
			expect(defaultStyle).not.toBe(customCss);
			expect(customStyleElem).toBe(customCss);
		});

		it("Custom CSS is inserted to override default styles", () => {
			const customStyle = ".invCard { background-color: lightgreen; }";

			render(
				<InviteCard
					invite={{...inv, org: {...inv.org, customInvCss: customStyle, customInvCssOverrides: true}}}
					handler={() => {}}
				/>,
			);

			const styleElems = document.querySelectorAll("style");
			expect(styleElems.length).toBe(1);
			expect(styleElems[0].textContent).toBe(customStyle);
		});
	});

	describe("Output values", () => {
		it("Default value are empty except ID", () => {
			render(
				<InviteCard
					invite={inv}
					handler={(output) => act(() => expect(output).toEqual({inviteId: inv.id, time: "", note: ""}))}
				/>,
			);
			screen.getByText("Submit").click();
		});

		it("Time selection applies time property", async () => {
			let output: CallCreationRequest = {inviteId: inv.id, time: "", note: "unset"};
			render(<InviteCard invite={inv} handler={(values) => (output = values)} />);
			act(() => screen.getByText("🗓️").click());
			await new Promise((resolve) => setTimeout(resolve, 50)); // TODO: hacky fix, find proper one
			screen.getByText("Submit").click();
			expect(output.time).toBeTruthy();
			// TODO: after creating time-selection subcomponent, change above check to checking for valid date (with Date(output.time) )
		});

		it("Message input applies note property", async () => {
			let output: CallCreationRequest = {inviteId: inv.id, time: "", note: ""};
			const noteText = "[Customer note regarding the call]";
			render(
				<InviteCard
					invite={{...inv, org: {...inv.org, customInvCssOverrides: true}}}
					handler={(values) => act(() => (output = values))}
				/>,
			);
			fireEvent.input(screen.getByPlaceholderText(/message/), {target: {value: noteText}});
			await new Promise((resolve) => setTimeout(resolve, 50)); // TODO: hacky fix, find proper one
			screen.getByText("Submit").click();
			expect(output).toEqual({inviteId: inv.id, time: "", note: noteText});
		});

		it("Time selection and message input apply both properties", async () => {
			let output: CallCreationRequest = {inviteId: inv.id, time: "", note: ""};
			const noteText = "[Customer note regarding the subject]";
			render(<InviteCard invite={inv} handler={(values) => (output = values)} />);
			act(() => screen.getByText("🗓️").click());
			await new Promise((resolve) => setTimeout(resolve, 50)); // TODO: hacky fix, find proper one
			fireEvent.input(screen.getByPlaceholderText(/message/), {target: {value: noteText}});
			screen.getByText("Submit").click();
			expect(output.inviteId).toBe(inv.id);
			expect(output.time).toBeTruthy(); // TODO: update to Date()-based check after implementing time-selection subcomponent
			expect(output.note).toBe(noteText);
		});
	});
});
