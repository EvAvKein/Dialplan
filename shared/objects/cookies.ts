type cookiePrefix = "dialplan_";

export type cookie = `${cookiePrefix}${"agentid" | "sessionid"}`;

export type cookies = {
	[key in cookie]?: string;
};
