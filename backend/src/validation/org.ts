import {z, type ZodSchema} from "zod";
import {org, agent} from "../../../shared/objects/validationRegex.js";
import * as classes from "../../../shared/objects/org.js";
import * as schemas from "./shared.js";

const trueOrNone = z.literal(true).optional();

const OrgCreationRequest = z.object({
	// not exported as it should never be accepted without being part of a OrgAgentCreationDuo
	name: z.string().trim().regex(org.name),
	color: z.string().trim().regex(org.color),
	timezone: z.string().trim().regex(org.timezone),
	// availability: schemas.availability,
}) satisfies ZodSchema<classes.OrgCreationRequest>;

export const AgentInternals = z.object({
	name: z.string().trim().optional(),
	employeeId: z.string().trim().optional(),
	permissions: z.object({
		viewDetailedAvailability: trueOrNone,
		editOwnDepartment: trueOrNone,
		management: z.object({agents: trueOrNone, organization: trueOrNone}).optional(),
	}),
}) satisfies ZodSchema<classes.AgentInternals>;

export const AgentCreationRequest = z.object({
	name: z.string().trim().regex(agent.name),
	department: z.string().trim().regex(agent.department),
	countryCode: schemas.countryCode,
	internals: AgentInternals,
}) satisfies ZodSchema<classes.AgentCreationRequest>;

export const OrgAgentCreationDuo = z.object({
	org: OrgCreationRequest,
	agent: AgentCreationRequest,
}) satisfies ZodSchema<classes.OrgAgentCreationDuo>;

export const tempSignInData = z.object({
	agentId: schemas.id,
	orgId: schemas.id,
}) satisfies ZodSchema<classes.tempSignInData>;
