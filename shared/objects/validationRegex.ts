/* eslint-disable no-useless-escape */ // for escaping the dash symbol in regex, because otherwise inputs' pattern attribute breaks (at least chrome) with a JS error claiming it's invalid regex

import {timezoneValues} from "./timezones.js";

export const shared = {
	phoneNumber: /^[1-9][0-9]{8}$/,
	countryCode: /^[1-9][0-9]{0,2}$/,
	timezone: new RegExp(timezoneValues.reduce((prev, current) => prev + "|" + current)),
};

export const org = {
	name: /^[\w \-]{1,30}$/iu,
	color: /^[0-9A-F]{6}$/i,
	timezone: shared.timezone,
} as const;

export const agent = {
	name: /^[\w \-]{1,30}$/iu, // max is not large enough for some names, but i'll make it clear that this is the name that'll appear on invites and should therefore be presentable. but also that approach might be too strict... i'll just have to see if using the unabbreviated versions of long names is that important to their cultures, even in business contexts, to be worth the design consequences
	department: /^[\w \-]{2,50}$/iu, // same as above, max length is subject to change
	countryCode: shared.countryCode,
} as const;
