import {z, type ZodSchema} from "zod";
import * as classes from "../../../../shared/objects/org.js";
import * as shared from "./shared.js";

const trueOrNone = z.literal(true).optional();

export const Org = z.object({
	id: z.string(),
	name: z.string(),
	color: z.string().regex(/^[0-9A-F]{6}$/i),
	timezone: z.string(),
	availability: shared.availability,
}) satisfies ZodSchema<classes.Org>;

export const AgentInternals = z.object({
	name: z.string().optional(),
	employeeId: z.string().optional(),
	permissions: z.object({
		viewDetailedAvailability: trueOrNone,
		editOwnDepartment: trueOrNone,
		management: z.object({agents: trueOrNone, organization: trueOrNone}).optional(),
	}),
}) satisfies ZodSchema<classes.AgentInternals>;

export const Agent = z.object({
	orgId: Org.shape.id,
	id: z.string(),
	name: z.string(),
	department: z.string(),
	countryCode: shared.countryCode,
	internals: AgentInternals,
}) satisfies ZodSchema<classes.Agent>;
