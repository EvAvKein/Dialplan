import {z, type ZodSchema} from "zod";
import * as classes from "../../../shared/objects/org.js";
import * as schemas from "./shared.js";

const trueOrNone = z.literal(true).optional();

const OrgCreationRequest = z.object({
	// not exported as it should never be accepted without being part of a OrgAgentCreationDuo
	name: z.string(),
	color: z.string().regex(/^[0-9A-F]{6}$/i),
	timezone: z.string(),
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
	name: z.string(),
	department: z.string(),
	countryCode: schemas.countryCode,
	internals: AgentInternals,
}) satisfies ZodSchema<classes.AgentCreationRequest>;

export const OrgAgentCreationDuo = z.object({
	org: OrgCreationRequest,
	agent: AgentCreationRequest,
});
