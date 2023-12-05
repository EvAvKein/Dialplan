CREATE TABLE IF NOT EXISTS "AgentSession" ( -- would've called it "Session" but that's a reserved keyword
    "id" UUID PRIMARY KEY,
    "agentId" UUID REFERENCES "Agent"("id")
);