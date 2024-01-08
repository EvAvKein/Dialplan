export type cookiePrefix = "dialplan_";

export type cookieProperty = "agentid" | "sessionid";

export type cookie<T extends cookieProperty = cookieProperty> = `${cookiePrefix}${T}`;

export type cookies = {
	[key in cookie]?: string;
};

export const cookieKeys: {[key in cookieProperty]: cookie<key>} = {
	agentid: "dialplan_agentid",
	sessionid: "dialplan_sessionid",
};
