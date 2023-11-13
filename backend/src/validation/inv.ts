import {z, type ZodSchema} from "zod";
import * as classes from "../../../shared/objects/inv.js";
import * as shared from "./shared.js";
import {Agent, Org} from "./org.js";

const Recipient = z.object({
	name: z.string(),
	phone: z.object({number: shared.phoneNumber, countryCode: shared.countryCode}),
}) satisfies ZodSchema<classes.Recipient>;

const InviteNotes = z.object({
	forRecipient: z.string().optional(),
	forOrg: z.string().optional(),
}) satisfies ZodSchema<classes.InviteNotes>;

export const Invite = z.object({
	id: z.string(),
	org: Org.pick({id: true, name: true, color: true}),
	agent: Agent.pick({id: true, name: true, department: true}),
	recipient: Recipient,
	callDuration: z.number().int().positive(),
	expiry: z.string(),
	notes: InviteNotes,
}) satisfies ZodSchema<classes.Invite>;

export const Call = z.object({
	id: z.string(),
	orgId: Org.shape.id,
	agent: Agent.shape.id,
	recipient: Recipient,
	time: shared.timeRange,
	notes: z.object({
		internal: z.string().optional(),
		external: z.string().optional(),
		byRecipient: z.string().optional(),
	}),
}) satisfies ZodSchema<classes.Call>;
