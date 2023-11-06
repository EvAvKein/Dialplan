import {v4 as newId} from "uuid";
import {Org, Agent} from "./org";
import {isoStamp, timeRange} from "./shared";

export interface Recipient {
	name: string;
	phone: {
		number: string;
		countryCode: string;
	};
}

export interface InviteNotes {
	forRecipient?: string;
	forOrg?: string;
}

export class Invite {
	id: string;
	org: Pick<Org, "id" | "name" | "color">;
	agent: Pick<Agent, "id" | "name" | "department">;
	recipient: Recipient;
	callDuration: number;
	expiry: isoStamp;
	notes: InviteNotes;

	constructor(
		org: Invite["org"],
		agent: Invite["agent"],
		recipient: Invite["recipient"],
		callDuration: Invite["callDuration"],
		expiry: Invite["expiry"],
		notes: Invite["notes"],
	) {
		this.id = newId();
		this.org = org;
		this.agent = agent;
		this.recipient = recipient;
		this.callDuration = callDuration;
		this.expiry = expiry;
		this.notes = notes;
	}
}

export class Call {
	id: string;
	orgId: Org["id"];
	agent: Agent["id"];
	recipient: Recipient;
	time: timeRange;
	notes: InviteNotes & {
		byRecipient?: string;
	};

	constructor(
		ordId: Call["orgId"],
		agent: Call["agent"],
		recipient: Call["recipient"],
		time: Call["time"],
		notes: Call["notes"],
	) {
		this.orgId = ordId;
		this.id = newId();
		this.agent = agent;
		this.recipient = recipient;
		this.time = time;
		this.notes = notes;
	}
}
