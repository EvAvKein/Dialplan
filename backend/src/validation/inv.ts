import {z, type ZodSchema} from "zod";
import * as classes from "../../../shared/objects/inv.js";
import * as schemas from "./shared.js";
import {invite} from "../../../shared/objects/validationRegex.js";

const Recipient = z.object({
	name: z.string().trim().regex(invite.recipient.name),
	phone: z.object({
		number: z.string().trim().regex(invite.recipient.phone.number),
		countryCode: z.string().trim().regex(invite.recipient.phone.countryCode),
	}),
}) satisfies ZodSchema<classes.CallRecipient>;

const InviteNotes = z.object({
	forRecipient: z.string().trim().regex(invite.notes.forRecipient!).optional(),
	forOrg: z.string().trim().regex(invite.notes.forOrg!).optional(),
}) satisfies ZodSchema<classes.InviteNotes>;

export const InviteCreationRequest = z.object({
	recipient: Recipient,
	callDuration: z.number().refine((val) => invite.callDuration.test(val.toString())),
	expiry: z.string().trim().datetime({precision: 0}),
	notes: InviteNotes,
}) satisfies ZodSchema<classes.InviteCreationRequest>;

export const CallCreationRequest = z.object({
	inviteId: schemas.id,
	time: schemas.timestamp,
	notes: z.object({byRecipient: z.string().optional()}),
}) satisfies ZodSchema<classes.CallCreationRequest>;
