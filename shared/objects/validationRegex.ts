/* eslint-disable no-useless-escape */ // for escaping the dash symbol in regex, because otherwise inputs' pattern attribute breaks (at least chrome) with a JS error claiming it's invalid regex
import {timezoneValues} from "./timezones.js";

// REMINDER: avoid flags for what's solvable with a pattern (except /u, which is applied automatically in frontend). these regexes are used for frontend inputs' "pattern" attribute, which doesn't support flags

export const shared = {
	phoneNumber: /^[1-9][0-9]{8}$/,
	countryCode: /^[1-9][0-9]{0,2}$/,
	timezone: new RegExp(timezoneValues.reduce((prev, current) => prev + "|" + current)),
};

export const org = {
	name: /^(?!\s)[\w \-]{1,30}(?<!\s)$/u,
	color: /^[0-9a-fA-F]{6}$/,
} as const;

export const agent = {
	name: /^(?!\s)[\w \-]{1,30}(?<!\s)$/u, // max is not large enough for some names, but i'll make it clear that this is the name that'll appear on invites and should therefore be presentable. but also that approach might be too strict... i'll just have to see if using the unabbreviated versions of long names is that important to their cultures, even in business contexts, to be worth the design consequences
	department: /^(?!\s)[\w \-]{2,50}(?<!\s)$/u, // same as above, max length is subject to change
	countryCode: shared.countryCode,
	timezone: shared.timezone,
} as const;
