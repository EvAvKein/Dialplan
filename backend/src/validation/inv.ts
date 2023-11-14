import {z, type ZodSchema} from "zod";
import * as classes from "../../../shared/objects/inv.js";
import * as schemas from "./shared.js";

const Recipient = z.object({
	name: z.string(),
	phone: z.object({number: schemas.phoneNumber, countryCode: schemas.countryCode}),
}) satisfies ZodSchema<classes.CallRecipient>;

const InviteNotes = z.object({
	forRecipient: z.string().optional(),
	forOrg: z.string().optional(),
}) satisfies ZodSchema<classes.InviteNotes>;

export const InviteCreationRequest = z.object({
	orgId: schemas.id,
	agentId: schemas.id,
	recipient: Recipient,
	callDuration: z.number().int().positive(),
	expiry: z.string(),
	notes: InviteNotes,
}) satisfies ZodSchema<classes.InviteCreationRequest>;

export const CallCreationRequest = z.object({
	orgId: schemas.id,
	agentId: schemas.id,
	recipient: Recipient,
	time: schemas.timeRange,
	notes: InviteNotes.extend({byRecipient: z.string().optional()}),
}) satisfies ZodSchema<classes.CallCreationRequest>;
