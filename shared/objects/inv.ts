import {v4 as newId} from "uuid";
import {Org, Agent} from "./org";
import {isoStamp, timeRange} from "./shared";

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

export class InviteClientData {
	constructor(
		public id: string,
		public org: Pick<Org, "id" | "name" | "color">,
		public agent: Pick<Agent, "id" | "name" | "department">,
		public recipient: CallRecipient,
		public callDuration: number,
		public expiry: isoStamp,
		public notes: InviteNotes,
	) {}
}

export class CallCreationRequest {
	constructor(
		public orgId: string,
		public agentId: string,
		public recipient: CallRecipient,
		public time: timeRange,
		public notes: InviteNotes & {
			byRecipient?: string;
		},
	) {}
}
export class Call extends CallCreationRequest {
	id: string;

	constructor(creationRequest: CallCreationRequest) {
		super(
			creationRequest.orgId,
			creationRequest.orgId,
			creationRequest.recipient,
			creationRequest.time,
			creationRequest.notes,
		);
		this.id = newId();
	}
}
