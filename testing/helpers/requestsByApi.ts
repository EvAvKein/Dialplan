import {type APIRequestContext as Request} from "@playwright/test";
import {type OrgCreationRequest, type AgentCreationRequest, OrgAgentCreationDuo} from "../../shared/objects/org";
import {randomAlphanumString} from "../../shared/helpers/randomAlphanumString";

interface partialCreationDuo {
	org?: Partial<OrgCreationRequest>;
	agent?: Partial<AgentCreationRequest>;
}

export async function signUp(request: Request, creationData?: partialCreationDuo) {
	return await request.post("/api/orgs", {
		data: {
			org: {
				name: creationData?.org?.name ?? randomAlphanumString(8),
				color: creationData?.org?.color ?? "654321",
			},
			agent: {
				name: creationData?.agent?.name ?? randomAlphanumString(15),
				department: creationData?.agent?.department ?? randomAlphanumString(20),
				countryCode: creationData?.agent?.countryCode ?? "358",
				timezone: creationData?.agent?.timezone ?? "Europe/Helsinki",
				internals: creationData?.agent?.internals ?? {permissions: {}},
			},
		} satisfies OrgAgentCreationDuo,
	});
}
