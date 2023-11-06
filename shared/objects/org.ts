import {v4 as newId} from "uuid";
import {availability} from "./shared.js";

export class Org {
	id: string;
	name: string;
	color: string;
	timezone: string;
	availability: availability;

	constructor(name: Org["name"], color: Org["color"], timezone: Org["timezone"], availability: Org["availability"]) {
		this.id = newId();
		this.name = name;
		this.color = color;
		this.timezone = timezone;
		this.availability = availability;
	}
}

export interface AgentInternals {
	name?: string;
	employeeId?: string;
	permissions: {
		viewDetailedAvailability?: true;
		editOwnDepartment?: true;
		management?: {agents?: true; organization?: true};
	};
}
export class Agent {
	orgId: Org["id"];
	id: string;
	name: string;
	department: string;
	countryCode: string;
	internals: AgentInternals;

	constructor(
		orgId: Agent["orgId"],
		name: Agent["name"],
		department: Agent["department"],
		countryCode: Agent["countryCode"],
		internals: Agent["internals"],
	) {
		this.orgId = orgId;
		this.id = newId();
		this.name = name;
		this.department = department;
		this.countryCode = countryCode;
		this.internals = internals;
	}
}
