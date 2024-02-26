/* eslint-disable no-useless-escape */ // for escaping the dash symbol in regex, because otherwise inputs' pattern attribute breaks (at least chrome) with a JS error claiming it's invalid regex
import {type recursiveRecord} from "../../shared/helpers/dataRecord.js";
import {type Org, type Agent} from "./org.js";
import {type Invite} from "./inv.js";
import {timezoneValues} from "./timezones.js";

export const shared = {
	phoneNumber: /^[0-9]{9}$/,
	countryCode: /^[1-9][0-9]{0,2}$/,
	timezone: new RegExp(timezoneValues.reduce((prev, current) => prev + "|" + current)),
};

export const org: Omit<Record<keyof Org, RegExp>, "id"> = {
	name: /^(?!\s)[\w '\-]{1,30}(?<!\s)$/u,
	color: /^[0-9a-fA-F]{6}$/,
};

export const agent: Omit<Record<keyof Agent, RegExp>, "id" | "orgId" | "internals"> = {
	name: /^(?!\s)[\w '\-]{1,30}(?<!\s)$/u, // max is not large enough for some names, but i'll make it clear that this is the name that'll appear on invites and should therefore be presentable. but also that approach might be too strict... i'll just have to see if using the unabbreviated versions of long names is that important to their cultures, even in business contexts, to be worth the design consequences
	department: /^(?!\s)[\w '\-]{2,50}(?<!\s)$/u, // same as above, max length is subject to change
	countryCode: shared.countryCode,
	timezone: shared.timezone,
} as const;

export const callRecipient = {
	name: /^(?!\s)[\w '\-]{1,30}(?<!\s)$/u,
	phone: {
		number: shared.phoneNumber,
		countryCode: shared.countryCode,
	},
} as const;
export const inviteNotes = {
	forRecipient: /^.{0,250}$/,
	forOrg: /^.{0,500}$/,
};
export const invite: Omit<recursiveRecord<Invite, RegExp>, "id" | "orgId" | "agentId" | "expiry"> = {
	recipient: callRecipient,
	callDuration: /^[1-9][0-9]{0,2}$/,
	notes: inviteNotes,
};
