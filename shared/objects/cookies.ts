export type cookiePrefix = "dialplan_";

export type cookieProperty = "sessionid";

export type cookie<T extends cookieProperty = cookieProperty> = `${cookiePrefix}${T}`;

export type cookies = {
	[key in cookie]?: string;
};

export const cookieKeys: {[key in cookieProperty]: cookie<key>} = {
	sessionid: "dialplan_sessionid",
};
