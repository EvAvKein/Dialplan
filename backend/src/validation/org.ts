import {z, type ZodSchema} from "zod";
import {regex, length} from "../../../shared/objects/validation.js";
import * as classes from "../../../shared/objects/org.js";
import * as schemas from "./shared.js";

const trueOrNone = z.literal(true).optional();

const OrgCreationRequest = z.object({
	// not exported as it should never be accepted without being part of a OrgAgentCreationDuo
	name: z.string().min(length.orgName.min).max(length.orgName.max),
	color: z.string().regex(regex.color),
	timezone: z.string().regex(regex.timezone),
	// availability: schemas.availability,
}) satisfies ZodSchema<classes.OrgCreationRequest>;

export const AgentInternals = z.object({
	name: z.string().optional(),
	employeeId: z.string().optional(),
	permissions: z.object({
		viewDetailedAvailability: trueOrNone,
		editOwnDepartment: trueOrNone,
		management: z.object({agents: trueOrNone, organization: trueOrNone}).optional(),
	}),
}) satisfies ZodSchema<classes.AgentInternals>;

export const AgentCreationRequest = z.object({
	name: z.string().min(length.agentName.min).max(length.agentName.max),
	department: z.string().min(length.agentDepartment.min).max(length.agentDepartment.max),
	countryCode: schemas.countryCode,
	internals: AgentInternals,
}) satisfies ZodSchema<classes.AgentCreationRequest>;

export const OrgAgentCreationDuo = z.object({
	org: OrgCreationRequest,
	agent: AgentCreationRequest,
}) satisfies ZodSchema<classes.OrgAgentCreationDuo>;
