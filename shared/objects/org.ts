import {v4 as newId} from "uuid";
// import {availability} from "./shared";

export interface AgentInternals {
	name?: string;
	employeeId?: string;
	permissions: {
		viewDetailedAvailability?: true;
		editOwnDepartment?: true;
		management?: {agents?: true; organization?: true};
	};
}
export class AgentCreationRequest {
	constructor(
		public name: string,
		public department: string,
		public countryCode: string,
		public internals: AgentInternals,
	) {}
}
export class Agent extends AgentCreationRequest {
	orgId: Org["id"];
	id: string;

	constructor(orgId: Agent["orgId"], creationRequest: AgentCreationRequest) {
		super(creationRequest.name, creationRequest.department, creationRequest.countryCode, creationRequest.internals);
		this.orgId = orgId;
		this.id = newId();
	}
}

export interface AgentSession {
	id: string;
	orgId: Org["id"];
	agentId: Agent["id"];
}

export class OrgCreationRequest {
	constructor(
		public name: string,
		public color: string,
		public timezone: string, // public availability: availability,
	) {}
}
export class Org extends OrgCreationRequest {
	id: string;

	constructor(creationRequest: OrgCreationRequest) {
		super(creationRequest.name, creationRequest.color, creationRequest.timezone /* creationRequest.availability*/);
		this.id = newId();
	}
}

export interface OrgAgentCreationDuo {
	org: OrgCreationRequest;
	agent: AgentCreationRequest;
}

export interface tempSignInData {
	// will be replaced with a proper sign-in process (currently prioritizing core features for product presentation's sake)
	agentId: Agent["id"];
	orgId: Org["id"];
}
