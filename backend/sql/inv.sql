CREATE TABLE IF NOT EXISTS "Invite" (
    "id" UUID PRIMARY KEY NOT NULL,
    "orgId" UUID REFERENCES "Org"("id") NOT NULL,
    "agentId" UUID REFERENCES "Agent"("id") NOT NULL,
    "recipient" JSON NOT NULL,
    "secCallDuration" SMALLINT NOT NULL,
    "expiry" TIMESTAMP NOT NULL,
    "notes" JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS "Call" (
    "id" UUID PRIMARY KEY NOT NULL,
    "orgId" UUID REFERENCES "Org"("id") NOT NULL,
    "agentId" UUID REFERENCES "Agent"("id") NOT NULL,
    "recipient" JSON NOT NULL,
    "time" TSRANGE NOT NULL,
    "notes" JSON NOT NULL
);