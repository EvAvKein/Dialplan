import {v4 as newId} from "uuid";
import {Org, Agent} from "./org.js";
import {isoStamp} from "./shared.js";

export interface CallRecipient {
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

export class InviteCreationRequest {
	constructor(
		public recipient: CallRecipient,
		public callDuration: number,
		public expiry: isoStamp,
		public notes: InviteNotes,
	) {}
}
export class Invite extends InviteCreationRequest {
	id: string;
	orgId: string;
	agentId: string;

	constructor(creationRequest: InviteCreationRequest, agentId: string, orgId: string) {
		super(creationRequest.recipient, creationRequest.callDuration, creationRequest.expiry, creationRequest.notes);
		this.agentId = agentId;
		this.orgId = orgId;
		this.id = newId();
	}
}

export class InvitePayload {
	id: string;
	org: Pick<Org, "name" | "color">;
	agent: Pick<Agent, "name" | "department">;
	recipient: CallRecipient;
	callDuration: number;
	expiry: isoStamp;
	message: string | undefined;

	constructor(invite: Invite, org: Org, agent: Agent) {
		this.id = invite.id;
		this.org = {name: org.name, color: org.color};
		this.agent = {name: agent.name, department: agent.department};
		this.recipient = invite.recipient;
		this.callDuration = invite.callDuration;
		this.expiry = invite.expiry;
		this.message = invite.notes.forRecipient;
	}
}

export class CallCreationRequest {
	constructor(
		public inviteId: string,
		public time: isoStamp,
		public note: string,
	) {}
}
export class Call {
	id: string;
	orgId: string;
	agentId: string;
	recipient: CallRecipient;
	time: isoStamp;
	notes: InviteNotes & {byRecipient?: string};

	constructor(invite: Invite, callCreationRequest: CallCreationRequest) {
		this.id = invite.id;
		this.orgId = invite.orgId;
		this.agentId = invite.agentId;
		this.recipient = invite.recipient;
		this.time = callCreationRequest.time;
		this.notes = {...invite.notes, byRecipient: callCreationRequest.note};
	}
}
