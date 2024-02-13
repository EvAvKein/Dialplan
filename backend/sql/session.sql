CREATE TABLE IF NOT EXISTS "AgentSession" ( -- would've named the table "Session" but that's a reserved keyword
    "id" UUID PRIMARY KEY,
    "agentId" UUID REFERENCES "Agent"("id")
);